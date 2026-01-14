/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * backend/server.js (FULL FILE REPLACEMENT — CommonJS for Render)
 *
 * Current behavior:
 * ✅ action=get: returns FLAT fields expected by NewCard.tsx
 * ✅ action=create: (optional) copy template -> dest folder, save link/meta to deal
 * ✅ action=refresh: sync Input-DB line items + set deal amount from Summary!J7 + update last synced
 * ✅ action=set-ready: FAST ONLY (toggles ready props). Does NOT sync line items or set amount.
 *
 * Performance upgrades:
 * ✅ Option A implemented: NO “search per row” for line items
 *    - fetch associated line item IDs once
 *    - batch read fee_sheet_key once
 *    - map fee_sheet_key -> line item
 * ✅ “Ready” is fast even during a long Sync:
 *    - set-ready uses a NO-QUEUE HubSpot patch (doesn’t wait behind sync’s serialized queue)
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

// ---------------------------
// HubSpot fetch + throttling + 429 retry (queued)
// ---------------------------

// Serialize HubSpot calls so sync work doesn’t burst above “secondly” limits.
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
    // Non-JSON response; keep json as null
  }

  if (!res.ok) {
    const msg = json?.message || text || `HubSpot error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
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
// Use this ONLY for fast single-shot actions (like set-ready) so they don’t wait
// behind a long-running sync that is using hsQueue.

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
    // Non-JSON response; keep json as null
  }

  if (!res.ok) {
    const msg = json?.error?.message || text || `Graph error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
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

  return { driveId, itemId, driveItem: json };
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

  const monitorUrl = copyRes.headers.get("location") || "";
  let newItem = null;

  if (monitorUrl) {
    for (let i = 0; i < 8; i++) {
      await sleep(900);
      const m = await fetch(monitorUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (m.status === 200) {
        try {
          const j = await m.json();
          const newItemId = j?.resourceId || j?.id || "";
          if (newItemId) {
            newItem = await graphGetDriveItem(
              accessToken,
              destDriveId,
              newItemId
            );
          }
        } catch {
          // ignore
        }
        break;
      }
    }
  }

  if (!newItem?.id) {
    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_file_name: fileName,
      fee_sheet_created_by: createdBy || "Unknown user",
      fee_sheet_created_at: toIsoNow(),
    });

    return {
      message:
        "Fee sheet creation started. Refresh the card in a few seconds to see the link.",
      feeSheetUrl: "",
      feeSheetFileName: fileName,
      feeSheetCreatedBy: createdBy || "Unknown user",
      lastUpdatedAt: "",
      spCreatedAt: "",
      spLastModifiedAt: "",
      feeSheetLastSyncedAt: "",
      readyForProposal: false,
      fee_sheet_ready_at: "",
      fee_sheet_ready_by: "",
    };
  }

  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_url: newItem.webUrl || "",
    fee_sheet_drive_id: destDriveId,
    fee_sheet_item_id: newItem.id,
    fee_sheet_file_name: newItem.name || fileName,
    fee_sheet_created_by: createdBy || "Unknown user",
    fee_sheet_created_at: toIsoNow(),
  });

  const flat = await buildFlatCardMeta(dealId, hubspotToken);
  return { message: "Fee sheet created ✅", ...flat };
}

// ---------------------------
// Line item sync (Input-DB) — Option A mapping (no per-row search)
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
  // HubSpot batch read commonly supports 100 per call; chunk to be safe.
  const chunks = chunkArray(ids, 100);
  const all = [];

  for (const c of chunks) {
    const body = {
      inputs: c.map((id) => ({ id })),
      properties: ["fee_sheet_key", "price", "name"],
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

async function buildExistingLineItemMapForDeal(token, dealId) {
  const ids = await hsGetDealAssociatedLineItemIds(token, dealId);
  const items = await hsBatchReadLineItems(token, ids);

  const map = new Map();
  for (const li of items) {
    const key = li?.properties?.fee_sheet_key;
    if (key) map.set(String(key), li);
  }
  return map;
}

async function hsCreateLineItem(token, props) {
  return hsFetchWithRetry(`/crm/v3/objects/line_items`, {
    method: "POST",
    token,
    body: { properties: props },
  });
}

async function hsUpdateLineItem(token, lineItemId, props) {
  return hsFetchWithRetry(`/crm/v3/objects/line_items/${lineItemId}`, {
    method: "PATCH",
    token,
    body: { properties: props },
  });
}

async function hsDeleteLineItem(token, lineItemId) {
  return hsFetchWithRetry(`/crm/v3/objects/line_items/${lineItemId}`, {
    method: "DELETE",
    token,
  });
}

async function hsAssociateLineItemToDeal(token, dealId, lineItemId) {
  return hsFetchWithRetry(
    `/crm/v4/objects/deals/${dealId}/associations/line_items/${lineItemId}/deal_to_line_item`,
    { method: "PUT", token }
  );
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

async function upsertInputDbLineItems({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl)
    throw new Error("No fee sheet URL found on this deal.");

  // Build existing map ONCE (Option A)
  const existingMap = await buildExistingLineItemMapForDeal(
    hubspotToken,
    dealId
  );

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

  const changes = [];
  const summary = { created: 0, updated: 0, deleted: 0, skipped: 0 };

  for (const blk of INPUT_DB_BLOCKS) {
    const fallback = getBlockFallbackName(namesValues, blk.start);

    for (let r = blk.start; r <= blk.end; r++) {
      const feeSheetKey = `INPUT_DB_ROW_${r}`;
      const amount = priceByRow.get(r) ?? 0;

      const rowName = getRowName(namesValues, r);
      const name = rowName || fallback || `Row ${r}`;

      const shouldExist = amount > 0;

      const existingItem = existingMap.get(feeSheetKey) || null;

      if (!shouldExist) {
        if (existingItem?.id) {
          await hsDeleteLineItem(hubspotToken, existingItem.id);
          existingMap.delete(feeSheetKey);
          summary.deleted += 1;
          changes.push({ row: r, key: feeSheetKey, action: "deleted" });
        } else {
          summary.skipped += 1;
          changes.push({ row: r, key: feeSheetKey, action: "skipped" });
        }
        continue;
      }

      const props = {
        name,
        price: String(amount),
        fee_sheet_key: feeSheetKey,
      };

      if (existingItem?.id) {
        await hsUpdateLineItem(hubspotToken, existingItem.id, props);
        summary.updated += 1;
        changes.push({
          row: r,
          key: feeSheetKey,
          action: "updated",
          price: amount,
          name,
        });
      } else {
        const created = await hsCreateLineItem(hubspotToken, props);
        const lineItemId = created?.id;

        if (lineItemId) {
          await hsAssociateLineItemToDeal(hubspotToken, dealId, lineItemId);
          // Keep map current (use minimal structure)
          existingMap.set(feeSheetKey, {
            id: lineItemId,
            properties: { fee_sheet_key: feeSheetKey },
          });
        }

        summary.created += 1;
        changes.push({
          row: r,
          key: feeSheetKey,
          action: "created",
          price: amount,
          name,
        });
      }
    }
  }

  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_last_synced_at: toIsoNow(),
    fee_sheet_last_synced_by: "Fee Sheet Backend",
  });

  return { changes, summary, debugSample };
}

// ---------------------------
// Routes
// ---------------------------

app.get("/", (_req, res) => {
  res.send("Fee Sheet backend is running.");
});

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

    // ---- GET (flat shape expected by card) ----
    if (action === "get") {
      const flat = await buildFlatCardMeta(dealId, HUBSPOT_TOKEN);
      return res.json(flat);
    }

    // ---- CREATE (card calls action=create) ----
    if (action === "create") {
      const out = await createFeeSheetFromTemplate({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
        createdBy: createdBy || "Unknown user",
      });
      return res.json(out);
    }

    // ---- REFRESH (sync line items + set amount from Summary!J7) ----
    if (action === "refresh") {
      const result = await upsertInputDbLineItems({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      const j7 = await getSummaryJ7Amount({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      if (j7.amount !== null) {
        await hubspotPatchDeal(dealId, HUBSPOT_TOKEN, {
          amount: String(j7.amount),
        });
      }

      const flat = await buildFlatCardMeta(dealId, HUBSPOT_TOKEN);

      return res.json({
        message: `Synced ✅ (+${result.summary.created} ~${
          result.summary.updated
        } -${result.summary.deleted}, skipped ${result.summary.skipped})${
          j7.amount !== null
            ? ` • Deal amount set to ${j7.amount}`
            : " • Deal amount not changed (Summary!J7 blank)"
        }`,
        feeSheetLastSyncedAt: flat.feeSheetLastSyncedAt,
        dealAmountUpdated: j7.amount !== null,
        dealAmountValue: j7.amount,
      });
    }

    // ---- Ready for proposal (FAST ONLY, uses fast-lane patch) ----
    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      const patchProps = {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_by: by,
        fee_sheet_ready_at: toIsoNow(),
      };

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
    });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
