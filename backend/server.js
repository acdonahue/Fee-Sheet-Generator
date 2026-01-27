/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * backend/server.js (FULL FILE REPLACEMENT — CommonJS for Render)
 *
 * Behavior:
 * ✅ action=get: returns FLAT fields expected by NewCard.tsx
 * ✅ action=create: (optional) copy template -> dest folder, save link/meta to deal
 * ✅ action=refresh (SYNC): authoritative sync from Excel
 *    - Deletes ALL line items currently associated to the deal (overwrite mode)
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

// Managed prefix — line items created by Sync will use this key
const MANAGED_KEY_PREFIX = "INPUT_DB_ROW_";

// HubSpot API base
const HS_BASE = "https://api.hubapi.com";

// ---------------------------
// Small helpers
// ---------------------------
function sanitizeFileName(s) {
  // SharePoint/OneDrive invalid characters: \ / : * ? " < > | and control chars
  return String(s || "")
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildNameFromTemplate(templateName, dealName) {
  const safeDealName = sanitizeFileName(dealName) || "Untitled Deal";
  const t = String(templateName || "").trim();

  const dashIndex = t.indexOf("-");
  const suffix = dashIndex === -1 ? "" : t.slice(dashIndex); // keeps the leading "-"
  const base = `${safeDealName}${suffix || "-Fee Sheet"}`;

  // Ensure .xlsx
  return base.toLowerCase().endsWith(".xlsx") ? base : `${base}.xlsx`;
}

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
function formatUSD(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
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
  } catch {}

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

async function graphGetRangeValues(accessToken, driveId, itemId, worksheetName, address) {
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
// ---------------------------
// FAST card meta (mostly NO Graph calls)
// Now: will do ONE Graph resolve only when URL exists AND ids are missing/mismatched
// ---------------------------
async function buildFlatCardMetaFast(dealId, hubspotToken) {
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

  // Start with what's stored
  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";
  let feeSheetFileName = meta.feeSheetFileName || "";

  // ✅ Self-heal: if URL changed (or ids missing), resolve and patch ids
  try {
    const accessToken = await getMsAccessToken();

    // Always resolve if ids are missing, OR if the URL was manually changed and the ids are now stale
    const resolved = await graphGetDriveItemFromShareLink(accessToken, meta.feeSheetUrl);

    const resolvedDriveId = resolved?.driveId || "";
    const resolvedItemId = resolved?.itemId || "";

    const idsMissing = !driveId || !itemId;
    const idsMismatch =
      resolvedDriveId &&
      resolvedItemId &&
      (resolvedDriveId !== driveId || resolvedItemId !== itemId);

    if (idsMissing || idsMismatch) {
      driveId = resolvedDriveId;
      itemId = resolvedItemId;

      const patchProps = {
        fee_sheet_drive_id: driveId,
        fee_sheet_item_id: itemId,
      };

      // Optional: refresh filename so UI matches the new URL immediately
      try {
        const item = await graphGetDriveItem(accessToken, driveId, itemId);
        const name = item?.name || "";
        if (name && name !== feeSheetFileName) {
          feeSheetFileName = name;
          patchProps.fee_sheet_file_name = name;
        }
      } catch {
        // ignore filename refresh failures
      }

      await hubspotPatchDeal(dealId, hubspotToken, patchProps);
    }
  } catch (e) {
    // Don't fail the card load — just log and keep using stored values
    console.log("[get] URL resolve/repair skipped:", e?.message || String(e));
  }

  const lastUpdatedAt = meta.feeSheetCreatedAt || meta.feeSheetLastSyncedAt || "";

  return {
    feeSheetUrl: meta.feeSheetUrl,
    feeSheetFileName: feeSheetFileName || "",
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
    const resolved = await graphGetDriveItemFromShareLink(accessToken, meta.feeSheetUrl);
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
  } catch {}

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

// Summary!J7 => Deal amount
async function getSummaryJ7Amount({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl) throw new Error("No fee sheet URL found on this deal.");

  const accessToken = await getMsAccessToken();

  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(accessToken, meta.feeSheetUrl);
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  const values = await graphGetRangeValues(accessToken, driveId, itemId, "Summary", "J7");
  const raw = getCell(values, 0, 0);

  if (raw === null || raw === undefined || String(raw).trim() === "") {
    return { raw, amount: null };
  }

  return { raw, amount: toNumberOrZero(raw) };
}
async function waitForFileByName(fileName, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const check = await graphChildNameExists(fileName);
    if (check.exists && check.items?.[0]?.id) return check.items[0];
    await sleep(2000);
  }
  return null;
}

// Create fee sheet (template copy) — OPTIONAL
async function createFeeSheetFromTemplate({ dealId, hubspotToken, createdBy }) {
  const existing = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

  // IMPORTANT:
  // Block duplicate creates even if fee_sheet_url is missing.
  // Adjust these keys if your meta object uses different names.
if (existing?.feeSheetUrl || existing?.feeSheetFileName || existing?.feeSheetCreatedAt) {

}
    const flat = await buildFlatCardMeta(dealId, hubspotToken);
    return {
      message: "Fee sheet already exists (or creation already started) for this deal.",
      ...flat,
    };
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

  // 1) Get deal name from HubSpot
  const dealProps = await hubspotGetDealRaw(dealId, hubspotToken, ["dealname"]);
  const dealName = dealProps?.dealname || `Deal ${dealId}`;

  // 2) Get template item name from Graph
  const templateItem = await graphGetDriveItem(accessToken, templateDriveId, templateItemId);
  const templateName = templateItem?.name || "Project Name-Fee Sheet Template.xlsx";

  // 3) Build final file name: "{Deal Name}{template suffix}"
  const baseFileName = buildNameFromTemplate(templateName, dealName);

  // Helpful logs (Render logs)
  console.log("[FeeSheet] deal:", { dealId, dealName });
  console.log("[FeeSheet] template:", { templateDriveId, templateItemId, templateName });
  console.log("[FeeSheet] dest:", { destDriveId, destFolderItemId });
  console.log("[FeeSheet] baseFileName:", baseFileName);

  // Helper: add " (n)" before .xlsx
  function withNumericSuffix(fileName, n) {
    if (!n) return fileName;
    return fileName.replace(/\.xlsx$/i, ` (${n}).xlsx`);
  }

  // Helper: check if a file with this name exists in the destination folder
  async function graphChildNameExists(fileName) {
    const escaped = String(fileName).replace(/'/g, "''"); // OData escape
    const url =
      `https://graph.microsoft.com/v1.0/drives/${destDriveId}/items/${destFolderItemId}` +
      `/children?$filter=name eq '${escaped}'&$select=id,name,webUrl`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const txt = await res.text();
      console.log("[FeeSheet] exists-check failed:", res.status, txt);
      return { exists: false, items: [] };
    }

    const json = await res.json();
    const items = Array.isArray(json?.value) ? json.value : [];
    return { exists: items.length > 0, items };
  }

  // Prove whether Graph thinks it exists BEFORE copy
  const existsCheck = await graphChildNameExists(baseFileName);
  console.log(
    "[FeeSheet] exists before copy?:",
    existsCheck.exists,
    existsCheck.items?.[0]?.webUrl || ""
  );

  // Try to copy. If nameAlreadyExists, retry with (1), (2), etc.
  let finalFileName = baseFileName;

  for (let i = 0; i < 15; i++) {
    finalFileName = withNumericSuffix(baseFileName, i);

    console.log(`[FeeSheet] copy attempt ${i + 1}/15:`, finalFileName);

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
          name: finalFileName,
        }),
      }
    );

    if (copyRes.ok) {
      console.log("[FeeSheet] copy accepted:", copyRes.status, finalFileName);
      break;
    }

    const txt = await copyRes.text();
// ✅ Wait for Graph async copy to finish and file to appear
const createdItem = await waitForFileByName(finalFileName, 60000);

if (!createdItem?.id) {
  // Copy was accepted but we couldn't find it yet (Graph delay)
  // At minimum keep the name/created fields, and return a message.
  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_file_name: finalFileName,
    fee_sheet_created_by: createdBy || "Unknown user",
    fee_sheet_created_at: toIsoNow(),
  });

  return {
    message: `Fee sheet creation queued ✅ (${finalFileName}). Refresh this deal in ~30–60 seconds.`,
    ...(await buildFlatCardMetaFast(dealId, hubspotToken)),
  };
}

// ✅ Create a share URL that your existing resolver supports
const shareUrl = await graphCreateViewLink(accessToken, destDriveId, createdItem.id);

// ✅ NOW set the important deal properties
await hubspotPatchDeal(dealId, hubspotToken, {
  fee_sheet_url: shareUrl,
  fee_sheet_drive_id: destDriveId,
  fee_sheet_item_id: createdItem.id,
  fee_sheet_file_name: createdItem.name || finalFileName,
  fee_sheet_created_by: createdBy || "Unknown user",
  fee_sheet_created_at: toIsoNow(),
});

const flat = await buildFlatCardMetaFast(dealId, hubspotToken);
return { message: `Fee sheet created ✅ (${createdItem.name || finalFileName})`, ...flat };

    // Only retry when the error is nameAlreadyExists
    if (txt.includes('"code":"nameAlreadyExists"')) {
      continue;
    }

    // Any other error should stop immediately
    throw new Error(`Template copy failed: ${txt}`);
  }

  // Save deal metadata so we don't keep trying to recreate
  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_file_name: finalFileName,
    fee_sheet_created_by: createdBy || "Unknown user",
    fee_sheet_created_at: toIsoNow(),
  });

  const flat = await buildFlatCardMeta(dealId, hubspotToken);
  return { message: `Fee sheet creation started ✅ (${finalFileName})`, ...flat };
}


// SYNC: authoritative line items from Input-DB
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

// Paged association fetch
async function hsGetDealAssociatedLineItemIds(token, dealId) {
  const ids = [];
  let after;

  while (true) {
    const path =
      `/crm/v3/objects/deals/${dealId}/associations/line_items?limit=500` +
      (after ? `&after=${encodeURIComponent(after)}` : "");

    const json = await hsFetchWithRetry(path, { token });

    const results = json?.results || [];
    for (const r of results) if (r?.id) ids.push(String(r.id));

    const next = json?.paging?.next?.after;
    if (!next) break;
    after = next;
  }

  return ids;
}

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

// Create-and-associate in ONE call
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
  if (!meta?.feeSheetUrl) throw new Error("No fee sheet URL found on this deal.");

  const accessToken = await getMsAccessToken();

  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(accessToken, meta.feeSheetUrl);
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  const associatedIds = await hsGetDealAssociatedLineItemIds(hubspotToken, dealId);
  console.log(`[sync] deal ${dealId}: associated line items = ${associatedIds.length}`);

  let deleted = 0;
  if (associatedIds.length) {
    await hsBatchArchiveLineItems(hubspotToken, associatedIds);
    deleted = associatedIds.length;
  }
  console.log(`[sync] deal ${dealId}: archived = ${deleted}`);

  const namesValues = await graphGetRangeValues(accessToken, driveId, itemId, "Input-DB", INPUT_DB_NAME_RANGE);
  const priceValues = await graphGetRangeValues(accessToken, driveId, itemId, "Input-DB", INPUT_DB_PRICE_RANGE);

  const debugSample = {
    keyProp: LINE_ITEM_KEY_PROP,
    B15: getCell(namesValues, 0, 0),
    B16: getCell(namesValues, 1, 0),
    AC16: getCell(priceValues, 0, 0),
  };

  const priceByRow = new Map();
  for (let i = 0; i < 145; i++) {
    const rowNumber = 16 + i;
    const raw = getCell(priceValues, i, 0);
    priceByRow.set(rowNumber, toNumberOrZero(raw));
  }

  let created = 0;
  let skipped = 0;
  const createdKeys = [];
  const seenKeys = new Set();

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
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);

      const props = { name, price: String(amount), [LINE_ITEM_KEY_PROP]: key };

      await hsCreateLineItemAndAssociateToDeal(hubspotToken, dealId, props);
      created += 1;
      createdKeys.push(key);
    }
  }

  console.log(`[sync] deal ${dealId}: created = ${created}, skipped = ${skipped}`);

  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_last_synced_at: toIsoNow(),
  });

  return {
    summary: { created, deleted, skipped },
    debugSample,
    createdKeysSample: createdKeys.slice(0, 10),
  };
}

// Routes
app.get("/", (_req, res) => res.send("Fee Sheet backend is running."));
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

    if (!dealId) return res.status(400).json({ message: "Missing dealId/objectId." });

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

    if (action === "refresh") {
      const syncResult = await syncLineItemsFromSheetAuthoritative({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      const j7 = await getSummaryJ7Amount({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });

      let attemptedAmount = null;
      let storedAmount = null;
      let amountNote = " • Deal amount not changed (Summary!J7 blank)";

      if (j7.amount !== null) {
        attemptedAmount = String(j7.amount);
        await hubspotPatchDeal(dealId, HUBSPOT_TOKEN, { amount: attemptedAmount });
        storedAmount = await hubspotReadDealAmount(dealId, HUBSPOT_TOKEN);

        if (storedAmount === attemptedAmount) {
          amountNote = `Deal amount set to ${attemptedAmount}`;
        } else {
          amountNote = `Attempted to set deal amount to ${attemptedAmount}, but HubSpot shows ${
            storedAmount || "(blank)"
          } (may be recalculated by line items/workflows)`;
        }
      }

      return res.json({
        message: `${amountNote}. Refresh to see line items.`,
        lineItemSummary: syncResult.summary,
        debugSample: syncResult.debugSample,
        createdKeysSample: syncResult.createdKeysSample,
        dealAmountAttempted: attemptedAmount,
        dealAmountAfter: storedAmount,
      });
    }

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
    const status = err?.status && Number.isFinite(err.status) ? err.status : 500;
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