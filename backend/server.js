/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * backend/server.js (FULL FILE REPLACEMENT — CommonJS for Render)
 *
 * Behavior:
 * ✅ action=get: returns FLAT fields expected by NewCard.tsx
 * ✅ action=create: (optional) copy template -> dest folder, save link/meta to deal
 * ✅ action=refresh (SYNC): authoritative sync from Excel
 *    - Deletes ALL fee-sheet-managed line items on the deal (fee_sheet_key starts with INPUT_DB_ROW_)
 *    - Recreates line items exactly reflecting current sheet values (amount > 0)
 *    - Sets deal amount from Summary!J7
 *    - Reads back deal amount to verify what HubSpot actually stored
 *    - Sets fee_sheet_last_synced_at
 * ✅ action=set-ready: FAST ONLY (toggles ready props). Does NOT sync line items or set amount.
 *
 * Required Render env vars:
 * - HUBSPOT_PRIVATE_APP_TOKEN (preferred)  [or HUBSPOT_TOKEN]
 * - MS_TENANT_ID
 * - MS_CLIENT_ID
 * - MS_CLIENT_SECRET
 *
 * Optional (to enable action=create):
 * - FEE_SHEET_TEMPLATE_SHARE_URL (share link to template file)
 * - FEE_SHEET_DEST_FOLDER_SHARE_URL (share link to destination folder)
 *
 * Optional tuning:
 * - HS_MIN_GAP_MS (default 180)
 * - LINE_ITEM_KEY_PROP (default "fee_sheet_key")  // internal name of the line-item key property
 */

const express = require("express");
const cors = require("cors");

// Optional dotenv for local dev; Render provides env vars without it.
try {
  require("dotenv").config();
} catch {
  // ignore if dotenv isn't installed (e.g., on Render)
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ---------------------------
// Env / constants
// ---------------------------

const HUBSPOT_TOKEN =
  process.env.HUBSPOT_PRIVATE_APP_TOKEN || process.env.HUBSPOT_TOKEN || "";

const MS_TENANT_ID = process.env.MS_TENANT_ID || "";
const MS_CLIENT_ID = process.env.MS_CLIENT_ID || "";
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET || "";

// OPTIONAL (only needed if you want backend to create the file from a template)
const FEE_SHEET_TEMPLATE_SHARE_URL =
  process.env.FEE_SHEET_TEMPLATE_SHARE_URL || "";
const FEE_SHEET_DEST_FOLDER_SHARE_URL =
  process.env.FEE_SHEET_DEST_FOLDER_SHARE_URL || "";

// Internal name of the line item key property in HubSpot
const LINE_ITEM_KEY_PROP = process.env.LINE_ITEM_KEY_PROP || "fee_sheet_key";

// Managed prefix — ONLY line items with this key prefix are owned by Sync
const MANAGED_KEY_PREFIX = "INPUT_DB_ROW_";

// HubSpot API base
const HS_BASE = "https://api.hubapi.com";

// ---------------------------
// Small helpers
// ---------------------------

function toIsoNow() {
  return new Date().toISOString();
}

function getCell(values, r, c) {
  if (!Array.isArray(values)) return null;
  if (!Array.isArray(values[r])) return null;
  return values[r][c] ?? null;
}

function toNumberOrZero(value) {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/[$,]/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Returns a numeric string if the input looks like an integer id, else null.
 * Use this to avoid writing names/emails into numeric HubSpot “user id” fields.
 */
function asLongStringOrNull(value) {
  const s = String(value ?? "").trim();
  return /^\d+$/.test(s) ? s : null;
}

// ---------------------------
// HubSpot fetch + throttling + 429 retry (queued)
// ---------------------------

let hsQueue = Promise.resolve();
let hsLastCallAt = 0;

// ~4–6 req/sec is usually safe; tune if needed.
const HS_MIN_GAP_MS = Number(process.env.HS_MIN_GAP_MS || 180);

async function hsRateLimitWait() {
  const now = Date.now();
  const wait = Math.max(0, HS_MIN_GAP_MS - (now - hsLastCallAt));
  if (wait) await sleep(wait);
  hsLastCallAt = Date.now();
}

async function hsFetch(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${HS_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // keep json null
  }

  if (!res.ok) {
    const msg = json?.message || text || `HubSpot error ${res.status}`;
    const err = new Error(`${msg} (path: ${path})`);
    err.status = res.status;
    err.payload = json;
    err.path = path;
    const retryAfter = res.headers.get("retry-after");
    err.retryAfterSeconds = retryAfter ? Number(retryAfter) : 0;
    throw err;
  }

  return json;
}

function hsEnqueue(fn) {
  hsQueue = hsQueue.then(fn, fn);
  return hsQueue;
}

async function hsFetchWithRetry(path, opts = {}, retries = 6) {
  return hsEnqueue(async () => {
    await hsRateLimitWait();

    try {
      return await hsFetch(path, opts);
    } catch (err) {
      if (err?.status === 429 && retries > 0) {
        const retryAfterMs = err.retryAfterSeconds
          ? Math.max(0, err.retryAfterSeconds) * 1000
          : 0;

        const attemptIndex = 6 - retries;
        const backoffMs = Math.min(
          12000,
          500 * Math.pow(2, attemptIndex) + Math.floor(Math.random() * 250)
        );

        await sleep(Math.max(retryAfterMs, backoffMs));
        return hsFetchWithRetry(path, opts, retries - 1);
      }
      throw err;
    }
  });
}

// ---------------------------
// HubSpot fast lane (NO queue)
// ---------------------------

async function hsFetchWithRetryNoQueue(path, opts = {}, retries = 4) {
  try {
    return await hsFetch(path, opts);
  } catch (err) {
    if (err?.status === 429 && retries > 0) {
      const retryAfterMs = err.retryAfterSeconds
        ? Math.max(0, err.retryAfterSeconds) * 1000
        : 700 + Math.floor(Math.random() * 250);
      await sleep(retryAfterMs);
      return hsFetchWithRetryNoQueue(path, opts, retries - 1);
    }
    throw err;
  }
}

// ---------------------------
// HubSpot helpers
// ---------------------------

async function hubspotPatchDeal(dealId, token, properties) {
  return hsFetchWithRetry(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    token,
    body: { properties },
  });
}

async function hubspotPatchDealFast(dealId, token, properties) {
  return hsFetchWithRetryNoQueue(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    token,
    body: { properties },
  });
}

async function hubspotGetDealRaw(dealId, token, propertiesList) {
  const data = await hsFetchWithRetry(
    `/crm/v3/objects/deals/${dealId}?properties=${encodeURIComponent(
      propertiesList.join(",")
    )}`,
    { token }
  );
  return data?.properties || {};
}

async function hubspotGetDealFeeSheetMeta(dealId, token) {
  const props = [
    "fee_sheet_url",
    "fee_sheet_drive_id",
    "fee_sheet_item_id",
    "fee_sheet_last_synced_at",
    "fee_sheet_last_synced_by",
    "fee_sheet_ready_for_proposal",
    "fee_sheet_ready_by",
    "fee_sheet_ready_at",
    "fee_sheet_file_name",
    "fee_sheet_created_by",
    "fee_sheet_created_at",
  ];

  const p = await hubspotGetDealRaw(dealId, token, props);

  return {
    feeSheetUrl: p.fee_sheet_url || "",
    feeSheetDriveId: p.fee_sheet_drive_id || "",
    feeSheetItemId: p.fee_sheet_item_id || "",
    feeSheetFileName: p.fee_sheet_file_name || "",
    feeSheetCreatedBy: p.fee_sheet_created_by || "",
    feeSheetCreatedAt: p.fee_sheet_created_at || "",
    feeSheetLastSyncedAt: p.fee_sheet_last_synced_at || "",
    feeSheetLastSyncedBy: p.fee_sheet_last_synced_by || "",
    readyForProposal:
      String(p.fee_sheet_ready_for_proposal || "").toLowerCase() === "true",
    readyBy: p.fee_sheet_ready_by || "",
    readyAt: p.fee_sheet_ready_at || "",
  };
}

async function hubspotReadDealAmount(dealId, token) {
  const data = await hsFetchWithRetry(
    `/crm/v3/objects/deals/${dealId}?properties=amount`,
    { token }
  );
  return data?.properties?.amount || "";
}

// ---------------------------
// Microsoft Graph helpers
// ---------------------------

async function getMsAccessToken() {
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET) {
    throw new Error(
      "Missing Microsoft Graph env vars (MS_TENANT_ID/MS_CLIENT_ID/MS_CLIENT_SECRET)."
    );
  }

  const tokenUrl = `https://login.microsoftonline.com/${MS_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.set("client_id", MS_CLIENT_ID);
  params.set("client_secret", MS_CLIENT_SECRET);
  params.set("grant_type", "client_credentials");
  params.set("scope", "https://graph.microsoft.com/.default");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error_description || "Failed to get MS access token");
  }
  return json.access_token;
}

async function graphFetch(accessToken, path, { method = "GET", body } = {}) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // keep json null
  }

  if (!res.ok) {
    const msg = json?.error?.message || text || `Graph error ${res.status}`;
    const err = new Error(`${msg} (path: ${path})`);
    err.status = res.status;
    err.payload = json;
    err.path = path;
    throw err;
  }

  return json;
}

async function graphGetDriveItemFromShareLink(accessToken, shareUrl) {
  const base64 = Buffer.from(shareUrl, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const token = `u!${base64}`;
  const json = await graphFetch(accessToken, `/shares/${token}/driveItem`);

  const driveId = json?.parentReference?.driveId || "";
  const itemId = json?.id || "";

  if (!driveId || !itemId) {
    throw new Error("Could not resolve share link to driveId/itemId.");
  }

  return { driveId, itemId };
}

async function graphGetRangeValues(
  accessToken,
  driveId,
  itemId,
  worksheetName,
  address
) {
  const encSheet = encodeURIComponent(worksheetName);
  const encAddr = encodeURIComponent(address);
  const json = await graphFetch(
    accessToken,
    `/drives/${driveId}/items/${itemId}/workbook/worksheets('${encSheet}')/range(address='${encAddr}')`
  );
  return json?.values || null;
}

async function graphGetDriveItem(accessToken, driveId, itemId) {
  return graphFetch(accessToken, `/drives/${driveId}/items/${itemId}`);
}

// ---------------------------
// Card meta (flat response expected by NewCard.tsx)
// ---------------------------


// ---------------------------
// FAST card meta (NO Graph calls)
// - Used for action=get so the card can render quickly even if the backend just woke up.
// - Returns HubSpot-stored fields only; SharePoint timestamps remain blank until a user-triggered action runs.
// ---------------------------
async function buildFlatCardMetaFast(dealId, hubspotToken) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

  // Keep response shape identical to the full meta builder so the UI doesn't branch.
  if (!meta.feeSheetUrl) {
    return {
      feeSheetUrl: "",
      feeSheetFileName: "",
      feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
      lastUpdatedAt: "",
      spCreatedAt: "",
      spLastModifiedAt: "",
      feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
      readyForProposal: meta.readyForProposal || false,
      fee_sheet_ready_at: meta.readyAt || "",
      fee_sheet_ready_by: meta.readyBy || "",
    };
  }

  // Best-effort “updated” timestamp without hitting Graph.
  // (We prefer SP last-modified, but that requires Graph—so fall back to what we already stored.)
  const lastUpdatedAt = meta.feeSheetCreatedAt || meta.feeSheetLastSyncedAt || "";

  return {
    feeSheetUrl: meta.feeSheetUrl,
    feeSheetFileName: meta.feeSheetFileName || "",
    feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
    lastUpdatedAt,
    spCreatedAt: "",
    spLastModifiedAt: "",
    feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
    readyForProposal: meta.readyForProposal || false,
    fee_sheet_ready_at: meta.readyAt || "",
    fee_sheet_ready_by: meta.readyBy || "",
  };
}

async function buildFlatCardMeta(dealId, hubspotToken) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

  if (!meta.feeSheetUrl) {
    return {
      feeSheetUrl: "",
      feeSheetFileName: "",
      feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
      lastUpdatedAt: "",
      spCreatedAt: "",
      spLastModifiedAt: "",
      feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
      readyForProposal: meta.readyForProposal || false,
      fee_sheet_ready_at: meta.readyAt || "",
      fee_sheet_ready_by: meta.readyBy || "",
    };
  }

  const accessToken = await getMsAccessToken();

  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  let spCreatedAt = "";
  let spLastModifiedAt = "";
  let feeSheetFileName = meta.feeSheetFileName || "";

  try {
    const item = await graphGetDriveItem(accessToken, driveId, itemId);
    spCreatedAt = item?.createdDateTime || "";
    spLastModifiedAt = item?.lastModifiedDateTime || "";
    feeSheetFileName = feeSheetFileName || item?.name || "";
  } catch {
    // ignore
  }

  const lastUpdatedAt = spLastModifiedAt || meta.feeSheetCreatedAt || "";

  return {
    feeSheetUrl: meta.feeSheetUrl,
    feeSheetFileName,
    feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
    lastUpdatedAt,
    spCreatedAt,
    spLastModifiedAt,
    feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
    readyForProposal: meta.readyForProposal || false,
    fee_sheet_ready_at: meta.readyAt || "",
    fee_sheet_ready_by: meta.readyBy || "",
  };
}

// ---------------------------
// Summary!J7 => Deal amount
// ---------------------------

async function getSummaryJ7Amount({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl)
    throw new Error("No fee sheet URL found on this deal.");

  const accessToken = await getMsAccessToken();

  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  const values = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Summary",
    "J7"
  );
  const raw = getCell(values, 0, 0);

  if (raw === null || raw === undefined || String(raw).trim() === "") {
    return { raw, amount: null };
  }

  return { raw, amount: toNumberOrZero(raw) };
}

// ---------------------------
// Create fee sheet (template copy) — OPTIONAL, env-driven
// ---------------------------

async function createFeeSheetFromTemplate({ dealId, hubspotToken, createdBy }) {
  const existing = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (existing?.feeSheetUrl) {
    const flat = await buildFlatCardMeta(dealId, hubspotToken);
    return { message: "Fee sheet already exists for this deal.", ...flat };
  }

  if (!FEE_SHEET_TEMPLATE_SHARE_URL || !FEE_SHEET_DEST_FOLDER_SHARE_URL) {
    const err = new Error(
      "Create is not configured. Set FEE_SHEET_TEMPLATE_SHARE_URL and FEE_SHEET_DEST_FOLDER_SHARE_URL on Render."
    );
    err.status = 501;
    throw err;
  }

  const accessToken = await getMsAccessToken();

  const templateResolved = await graphGetDriveItemFromShareLink(
    accessToken,
    FEE_SHEET_TEMPLATE_SHARE_URL
  );
  const destResolved = await graphGetDriveItemFromShareLink(
    accessToken,
    FEE_SHEET_DEST_FOLDER_SHARE_URL
  );

  const templateDriveId = templateResolved.driveId;
  const templateItemId = templateResolved.itemId;

  const destDriveId = destResolved.driveId;
  const destFolderItemId = destResolved.itemId;

  const fileName = `Fee Sheet - Deal ${dealId}.xlsx`;

  const copyRes = await fetch(
    `https://graph.microsoft.com/v1.0/drives/${templateDriveId}/items/${templateItemId}/copy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parentReference: { driveId: destDriveId, id: destFolderItemId },
        name: fileName,
      }),
    }
  );

  if (!copyRes.ok) {
    const txt = await copyRes.text();
    throw new Error(`Template copy failed: ${txt}`);
  }

  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_file_name: fileName,
    fee_sheet_created_by: createdBy || "Unknown user",
    fee_sheet_created_at: toIsoNow(),
  });

  const flat = await buildFlatCardMeta(dealId, hubspotToken);
  return { message: "Fee sheet creation started ✅", ...flat };
}

// ---------------------------
// SYNC: authoritative managed line items from Input-DB
// ---------------------------

const INPUT_DB_NAME_RANGE = "B15:B160";
const INPUT_DB_PRICE_RANGE = "AC16:AC160";

const INPUT_DB_BLOCKS = [
  { start: 16, end: 25 },
  { start: 31, end: 40 },
  { start: 46, end: 55 },
  { start: 61, end: 70 },
  { start: 76, end: 85 },
  { start: 91, end: 100 },
  { start: 106, end: 115 },
  { start: 121, end: 130 },
  { start: 136, end: 145 },
  { start: 150, end: 160 },
];

async function hsGetDealAssociatedLineItemIds(token, dealId) {
  const deal = await hsFetchWithRetry(
    `/crm/v3/objects/deals/${dealId}?associations=line_items`,
    { token }
  );
  const results = deal?.associations?.line_items?.results || [];
  return results.map((r) => r.id).filter(Boolean);
}

async function hsBatchReadLineItems(token, ids) {
  if (!ids.length) return [];
  const chunks = chunkArray(ids, 100);
  const all = [];

  for (const c of chunks) {
    const body = {
      inputs: c.map((id) => ({ id })),
      properties: [LINE_ITEM_KEY_PROP, "price", "name"],
    };

    const json = await hsFetchWithRetry(
      `/crm/v3/objects/line_items/batch/read`,
      {
        method: "POST",
        token,
        body,
      }
    );

    all.push(...(json?.results || []));
  }

  return all;
}

async function hsDeleteLineItem(token, lineItemId) {
  return hsFetchWithRetry(`/crm/v3/objects/line_items/${lineItemId}`, {
    method: "DELETE",
    token,
  });


async function hsBatchArchiveLineItems(token, ids) {
  if (!ids.length) return;
  const chunks = chunkArray(ids, 100);
  for (const c of chunks) {
    const body = { inputs: c.map((id) => ({ id: String(id) })) };
    await hsFetchWithRetry(`/crm/v3/objects/line_items/batch/archive`, {
      method: "POST",
      token,
      body,
    });
  }
}
}

// Create-and-associate in ONE call (no separate association endpoint).
async function hsCreateLineItemAndAssociateToDeal(token, dealId, props) {
  const body = {
    properties: props,
    associations: [
      {
        to: { id: String(dealId) },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 20,
          },
        ],
      },
    ],
  };

  return hsFetchWithRetry(`/crm/v3/objects/line_items`, {
    method: "POST",
    token,
    body,
  });
}

function getBlockFallbackName(namesValues, blockStartRow) {
  const headerRow = blockStartRow - 1;
  const idx = headerRow - 15;
  const val = getCell(namesValues, idx, 0);
  return val ? String(val).trim() : "";
}

function getRowName(namesValues, row) {
  const idx = row - 15;
  const val = getCell(namesValues, idx, 0);
  return val ? String(val).trim() : "";
}

async function syncLineItemsFromSheetAuthoritative({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl)
    throw new Error("No fee sheet URL found on this deal.");

  // Resolve file for Graph
  const accessToken = await getMsAccessToken();

  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  // 1) Pull existing associated line items (and find the managed ones by key prefix)
  // 1) Find all line items currently associated to this deal
  const associatedIds = await hsGetDealAssociatedLineItemIds(
    hubspotToken,
    dealId
  );

// Overwrite behavior: remove *all* existing line items on the deal, then recreate from the sheet.
  // WARNING: this will delete manual line items too.
  const toDelete = associatedIds.slice();
  let deleted = 0;
  if (toDelete.length) {
    await hsBatchArchiveLineItems(hubspotToken, toDelete);
    deleted = toDelete.length;
  }

// 3) Read Excel ranges
  const namesValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Input-DB",
    INPUT_DB_NAME_RANGE
  );

  const priceValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Input-DB",
    INPUT_DB_PRICE_RANGE
  );

  const debugSample = {
    keyProp: LINE_ITEM_KEY_PROP,
    B15: getCell(namesValues, 0, 0),
    B16: getCell(namesValues, 1, 0),
    AC16: getCell(priceValues, 0, 0),
  };

  // Map rows 16..160 -> prices (145 rows)
  const priceByRow = new Map();
  for (let i = 0; i < 145; i++) {
    const rowNumber = 16 + i;
    const raw = getCell(priceValues, i, 0);
    priceByRow.set(rowNumber, toNumberOrZero(raw));
  }

  // 4) Recreate managed line items exactly from sheet
  let created = 0;
  let skipped = 0;
  const createdKeys = [];

  for (const blk of INPUT_DB_BLOCKS) {
    const fallback = getBlockFallbackName(namesValues, blk.start);

    for (let r = blk.start; r <= blk.end; r++) {
      const amount = priceByRow.get(r) ?? 0;
      if (!(amount > 0)) {
        skipped += 1;
        continue;
      }

      const rowName = getRowName(namesValues, r);
      const name = rowName || fallback || `Row ${r}`;

      const key = `${MANAGED_KEY_PREFIX}${r}`;

      const props = {
        name,
        price: String(amount),
        [LINE_ITEM_KEY_PROP]: key,
      };

      await hsCreateLineItemAndAssociateToDeal(hubspotToken, dealId, props);
      created += 1;
      createdKeys.push(key);
    }
  }

  // 5) Mark last synced timestamp (NO *_by fields)
  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_last_synced_at: toIsoNow(),
  });

  return {
    summary: { created, deleted, skipped },
    debugSample,
    createdKeysSample: createdKeys.slice(0, 10),
  };
}

// ---------------------------
// Routes
// ---------------------------

app.get("/", (_req, res) => {
  res.send("Fee Sheet backend is running.");
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

app.all("/api/fee-sheet", async (req, res) => {
  try {
    if (!HUBSPOT_TOKEN) {
      return res.status(500).json({
        message:
          "Missing HubSpot token env var. Set HUBSPOT_PRIVATE_APP_TOKEN (preferred) or HUBSPOT_TOKEN.",
      });
    }

    const input = req.method === "GET" ? req.query : req.body;

    const action = input.action || "";
    const dealId = input.objectId || input.dealId || "";
    const ready = input.ready;
    const updatedBy = input.updatedBy;
    const createdBy = input.createdBy;

    if (!dealId) {
      return res.status(400).json({ message: "Missing dealId/objectId." });
    }

    if (action === "get") {
      const flat = await buildFlatCardMetaFast(dealId, HUBSPOT_TOKEN);
      return res.json(flat);
    }

    if (action === "create") {
      const out = await createFeeSheetFromTemplate({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
        createdBy: createdBy || "Unknown user",
      });
      return res.json(out);
    }

    // SYNC button
    if (action === "refresh") {
      // 1) authoritative line item sync
      const syncResult = await syncLineItemsFromSheetAuthoritative({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      // 2) get Summary!J7 and attempt to write to amount
      const j7 = await getSummaryJ7Amount({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      let attemptedAmount = null;
      let storedAmount = null;
      let amountNote = " • Deal amount not changed (Summary!J7 blank)";

      if (j7.amount !== null) {
        attemptedAmount = String(j7.amount);
        await hubspotPatchDeal(dealId, HUBSPOT_TOKEN, {
          amount: attemptedAmount,
        });

        // Read back what HubSpot actually stored (handles auto-recalc / workflows)
        storedAmount = await hubspotReadDealAmount(dealId, HUBSPOT_TOKEN);

        if (storedAmount === attemptedAmount) {
          amountNote = ` • Deal amount set to ${attemptedAmount}`;
        } else {
          amountNote = ` • Attempted to set deal amount to ${attemptedAmount}, but HubSpot shows ${
            storedAmount || "(blank)"
          } (may be recalculated by line items/workflows)`;
        }
      }

      return res.json({
        message: `Synced ✅ (deleted ${syncResult.summary.deleted}, created ${syncResult.summary.created}, skipped ${syncResult.summary.skipped})${amountNote}`,
        lineItemSummary: syncResult.summary,
        debugSample: syncResult.debugSample,
        createdKeysSample: syncResult.createdKeysSample,
        dealAmountAttempted: attemptedAmount,
        dealAmountAfter: storedAmount,
      });
    }

    // Ready button (fast only)
    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      const patchProps = {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_at: toIsoNow(),
      };

      const maybeLong = asLongStringOrNull(by);
      if (maybeLong) patchProps.fee_sheet_ready_by = maybeLong;

      await hubspotPatchDealFast(dealId, HUBSPOT_TOKEN, patchProps);

      return res.json({
        message: next
          ? "Ready status updated ✅ (sync + amount are handled by the Sync button)"
          : "Ready status updated ✅",
        readyForProposal: next,
      });
    }

    return res.status(400).json({ message: `Unknown action: ${action}` });
  } catch (err) {
    const status =
      err?.status && Number.isFinite(err.status) ? err.status : 500;
    console.error("Server error:", err);
    return res.status(status).json({
      message: "Server error",
      error: err?.message || String(err),
      path: err?.path || undefined,
    });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
