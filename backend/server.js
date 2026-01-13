/**
 * server.js (FULL FILE REPLACEMENT — Input-DB line items + robust association + better debugging)
 *
 * What this does:
 * - When Ready for proposal is clicked (action=set-ready, ready=true)
 *   → reads "Input-DB" B15:B160 and AC16:AC160
 *   → for rows 16-25, 31-40, 46-55, 61-70, 76-85, 91-100, 106-115, 121-130, 136-145, 150-160:
 *      - price = AC[row]
 *      - if price > 0: create/update custom line item (NO SKU) with:
 *          name = B[row] else B[row-1] else "Fee Sheet Row <row>"
 *          price = AC[row], quantity=1, fee_sheet_key = INPUT_DB_ROW_<row>
 *      - if price <= 0: delete previously-generated line item for that row key (if exists)
 *
 * Fixes included vs your pasted file:
 * ✅ Uses a dynamic Deal↔Line Item association typeId (no hard-coded 19)
 * ✅ PATCHES resolved driveId/itemId back onto the Deal (more reliable future reads)
 * ✅ Returns more useful info to the UI (lineItemSummary + debugSample)
 * ✅ Adds console logs you can view in Render logs when clicking Ready
 */

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

app.get("/__version", (req, res) =>
  res.json({
    version: "INPUT_DB_LINEITEMS_CUSTOM_NO_SKU_2026-01-13b",
    now: new Date().toISOString(),
  })
);

/**
 * ----------------------------
 * Helpers
 * ----------------------------
 */
function withTimeout(promise, ms, label = "timeout") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(label)), ms)),
  ]);
}

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

function toIsoNow() {
  return new Date().toISOString();
}

function toNumberOrZero(v) {
  const n = Number(
    String(v ?? "")
      .replace(/[$,]/g, "")
      .trim()
  );
  return Number.isFinite(n) ? n : 0;
}

function normalizeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function summarizeLineItemChanges(changes) {
  const summary = { created: 0, updated: 0, deleted: 0, skipped: 0 };
  for (const c of changes || []) {
    const a = String(c?.action || "").toLowerCase();
    if (a === "created") summary.created++;
    else if (a === "updated") summary.updated++;
    else if (a === "deleted") summary.deleted++;
    else summary.skipped++;
  }
  return summary;
}

/**
 * ----------------------------
 * HubSpot helpers
 * ----------------------------
 */
async function hubspotPatchDeal(dealId, token, properties) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HubSpot update failed: ${resp.status} ${text}`);
  }
}

async function hubspotGetDealFeeSheetMeta(dealId, token) {
  const props = [
    "fee_sheet_url",
    "fee_sheet_created_by",
    "fee_sheet_created_at",
    "fee_sheet_file_name",
    "fee_sheet_drive_id",
    "fee_sheet_item_id",
    "fee_sheet_ready_for_proposal",
    "fee_sheet_ready_by",
    "fee_sheet_ready_at",
    "fee_sheet_last_synced_at",
  ].join(",");

  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=${props}`,
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  );

  if (!resp.ok) {
    return {
      feeSheetUrl: "",
      feeSheetCreatedAt: "",
      feeSheetCreatedBy: "",
      feeSheetFileName: "",
      feeSheetDriveId: "",
      feeSheetItemId: "",
      readyForProposal: false,
      readyBy: "",
      readyAt: "",
      feeSheetLastSyncedAt: "",
    };
  }

  const json = await resp.json();
  const p = json?.properties || {};

  return {
    feeSheetUrl: p.fee_sheet_url || "",
    feeSheetCreatedAt: p.fee_sheet_created_at || "",
    feeSheetCreatedBy: p.fee_sheet_created_by || "",
    feeSheetFileName: p.fee_sheet_file_name || "",
    feeSheetDriveId: p.fee_sheet_drive_id || "",
    feeSheetItemId: p.fee_sheet_item_id || "",
    readyForProposal:
      String(p.fee_sheet_ready_for_proposal || "").toLowerCase() === "true",
    readyBy: p.fee_sheet_ready_by || "",
    readyAt: p.fee_sheet_ready_at || "",
    feeSheetLastSyncedAt: p.fee_sheet_last_synced_at || "",
  };
}

async function hubspotListLineItemIdsForDeal(dealId, token) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_items`,
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  );

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Line item associations failed ${resp.status}: ${text}`);

  const json = safeJsonParse(text);
  const results = Array.isArray(json?.results) ? json.results : [];
  return results.map((r) => String(r?.id)).filter(Boolean);
}

async function hubspotBatchReadLineItems(token, ids, properties = []) {
  if (!ids.length) return [];

  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/line_items/batch/read`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: ids.map((id) => ({ id })),
        properties,
      }),
    }
  );

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Batch read line items failed ${resp.status}: ${text}`);

  const json = safeJsonParse(text);
  return Array.isArray(json?.results) ? json.results : [];
}

async function hubspotCreateLineItem(token, properties) {
  const resp = await fetch(`https://api.hubapi.com/crm/v3/objects/line_items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Create line item failed ${resp.status}: ${text}`);

  return safeJsonParse(text);
}

async function hubspotUpdateLineItem(lineItemId, token, properties) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    }
  );

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Update line item failed ${resp.status}: ${text}`);
}

async function hubspotDeleteLineItem(lineItemId, token) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/line_items/${lineItemId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (resp.status === 404) return;

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Delete line item failed ${resp.status}: ${text}`);
}

/**
 * ✅ NEW: dynamically fetch the correct association typeId for deals ↔ line_items.
 * This avoids hardcoding "19", which can differ by portal/config.
 */
let assocTypeIdCache = null;

async function hubspotGetDealToLineItemAssocTypeId(token) {
  if (assocTypeIdCache) return assocTypeIdCache;

  const resp = await fetch(
    "https://api.hubapi.com/crm/v4/associations/deals/line_items/labels",
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  );

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch association labels: ${resp.status} ${text}`
    );
  }

  const json = safeJsonParse(text);
  const results = Array.isArray(json?.results) ? json.results : [];

  const best =
    results.find((r) =>
      String(r?.label || "")
        .toLowerCase()
        .includes("deal")
    ) || results[0];

  if (!best?.typeId) {
    throw new Error(`No association typeId found in labels response: ${text}`);
  }

  assocTypeIdCache = best.typeId;
  return assocTypeIdCache;
}

async function hubspotAssociateLineItemToDeal(lineItemId, dealId, token) {
  const typeId = await hubspotGetDealToLineItemAssocTypeId(token);

  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_items/${lineItemId}/${typeId}`;

  const resp = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(
      `Associate line item failed ${resp.status}: ${
        text || "(empty body)"
      } (typeId=${typeId})`
    );
  }
}

/**
 * ----------------------------
 * Microsoft Graph helpers
 * ----------------------------
 */
let msTokenCache = { token: "", expiresAtMs: 0 };

async function getMsAccessToken() {
  const now = Date.now();

  if (msTokenCache.token && msTokenCache.expiresAtMs - 60_000 > now) {
    return msTokenCache.token;
  }

  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Missing Microsoft secrets (MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET)"
    );
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = await resp.json();
  if (!resp.ok)
    throw new Error(
      `Microsoft token error: ${resp.status} ${JSON.stringify(json)}`
    );

  const accessToken = json.access_token || "";
  const expiresInSec = Number(json.expires_in || 0);

  msTokenCache = {
    token: accessToken,
    expiresAtMs: Date.now() + Math.max(0, expiresInSec) * 1000,
  };

  return accessToken;
}

function shareLinkToShareId(url) {
  const b64 = Buffer.from(url, "utf8").toString("base64");
  return "u!" + b64.replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function graphJson(accessToken, url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await resp.text();
  const json = safeJsonParse(text);

  if (!resp.ok) throw new Error(`Graph error ${resp.status}: ${text}`);
  return { resp, json, text };
}

async function graphGetDriveItemFromShareLink(accessToken, shareLink) {
  const shareId = shareLinkToShareId(shareLink);
  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem`
  );

  return {
    id: json?.id || "",
    name: json?.name || "",
    webUrl: json?.webUrl || "",
    lastModifiedDateTime: json?.lastModifiedDateTime || "",
    createdDateTime: json?.createdDateTime || "",
    parentDriveId: json?.parentReference?.driveId || "",
  };
}

function escapeODataString(s) {
  return String(s || "").replace(/'/g, "''");
}

async function graphGetRangeValues(
  accessToken,
  driveId,
  itemId,
  worksheetName,
  address
) {
  const ws = escapeODataString(worksheetName);
  const addr = escapeODataString(address);

  const url =
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}` +
    `/workbook/worksheets('${ws}')/range(address='${addr}')?$select=values`;

  const { json } = await graphJson(accessToken, url);
  return Array.isArray(json?.values) ? json.values : [];
}

function getCell(values2d, r, c) {
  return Array.isArray(values2d) && Array.isArray(values2d[r])
    ? values2d[r][c]
    : null;
}

/**
 * ----------------------------
 * Input-DB Line Item generator
 * ----------------------------
 */
const INPUT_DB_SHEET = "Input-DB";

const INPUT_DB_ROW_BLOCKS = [
  [16, 25],
  [31, 40],
  [46, 55],
  [61, 70],
  [76, 85],
  [91, 100],
  [106, 115],
  [121, 130],
  [136, 145],
  [150, 160],
];

function buildTargetRows() {
  const rows = [];
  for (const [start, end] of INPUT_DB_ROW_BLOCKS) {
    for (let r = start; r <= end; r++) rows.push(r);
  }
  return rows;
}

const TARGET_ROWS = buildTargetRows();

function keyForRow(r) {
  return `INPUT_DB_ROW_${r}`;
}

async function upsertInputDbLineItems({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl)
    throw new Error("No fee sheet URL found on this deal.");

  const accessToken = await getMsAccessToken();

  // Ensure drive/item IDs exist (resolve via share link if needed)
  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.parentDriveId || "";
    itemId = resolved.id || "";

    if (!driveId || !itemId)
      throw new Error("Could not determine driveId/itemId for fee sheet.");

    // ✅ NEW: cache these back to the deal for future calls
    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  // Read needed ranges
  const namesValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    INPUT_DB_SHEET,
    "B15:B160"
  );

  const priceValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    INPUT_DB_SHEET,
    "AC16:AC160"
  );

  // ✅ Debug sample visible in Render logs
  console.log("[Input-DB] sample read", {
    sheet: INPUT_DB_SHEET,
    driveId,
    itemId,
    B45: getCell(namesValues, 45 - 15, 0),
    B46: getCell(namesValues, 46 - 15, 0),
    AC46: getCell(priceValues, 46 - 16, 0),
  });

  // Map row -> name
  const nameByRow = new Map();
  for (let row = 15; row <= 160; row++) {
    const idx = row - 15;
    const raw = getCell(namesValues, idx, 0);
    nameByRow.set(row, normalizeText(raw));
  }

  // Map row -> price
  const priceByRow = new Map();
  for (let row = 16; row <= 160; row++) {
    const idx = row - 16;
    const raw = getCell(priceValues, idx, 0);
    priceByRow.set(row, toNumberOrZero(raw));
  }

  // Existing line items indexed by fee_sheet_key
  const existingIds = await hubspotListLineItemIdsForDeal(dealId, hubspotToken);
  const existing = await hubspotBatchReadLineItems(hubspotToken, existingIds, [
    "fee_sheet_key",
    "name",
    "price",
    "quantity",
  ]);

  const existingByKey = new Map();
  for (const li of existing) {
    const k = li?.properties?.fee_sheet_key;
    if (k) existingByKey.set(String(k), li);
  }

  const changes = [];

  for (const r of TARGET_ROWS) {
    const amount = priceByRow.get(r) ?? 0;
    const shouldExist = amount > 0;

    const directName = nameByRow.get(r) || "";
    const fallbackName = nameByRow.get(r - 1) || "";
    const finalName = directName || fallbackName || `Fee Sheet Row ${r}`;

    const key = keyForRow(r);
    const existingLi = existingByKey.get(key);

    if (!shouldExist) {
      if (existingLi?.id) {
        await hubspotDeleteLineItem(String(existingLi.id), hubspotToken);
        changes.push({ row: r, key, action: "deleted", amount });
      } else {
        changes.push({ row: r, key, action: "skipped", amount });
      }
      continue;
    }

    const props = {
      fee_sheet_key: key,
      name: finalName,
      price: String(amount),
      quantity: "1",
    };

    if (existingLi?.id) {
      await hubspotUpdateLineItem(String(existingLi.id), hubspotToken, props);
      changes.push({ row: r, key, action: "updated", amount, name: finalName });
    } else {
      const created = await hubspotCreateLineItem(hubspotToken, props);
      const newId = created?.id;
      if (!newId) throw new Error(`Line item create returned no id (row ${r})`);

      // ✅ Uses dynamic assoc typeId
      await hubspotAssociateLineItemToDeal(String(newId), dealId, hubspotToken);

      changes.push({
        row: r,
        key,
        action: "created",
        amount,
        name: finalName,
        lineItemId: String(newId),
      });
    }
  }

  const summary = summarizeLineItemChanges(changes);

  // Return a little sample to display in UI if needed
  const debugSample = {
    sheet: INPUT_DB_SHEET,
    B46: nameByRow.get(46) || "",
    B45: nameByRow.get(45) || "",
    AC46: priceByRow.get(46) ?? 0,
  };

  return { changes, summary, debugSample };
}

/**
 * ----------------------------
 * Main endpoint
 * ----------------------------
 */
app.all("/api/fee-sheet", async (req, res) => {
  try {
    const action = String(req.query.action || req.body?.action || "");
    const dealId = String(req.query.objectId || req.body?.objectId || "");
    const createdBy = String(req.query.createdBy || req.body?.createdBy || "");
    const ready = String(req.query.ready || req.body?.ready || "");
    const updatedBy = String(req.query.updatedBy || req.body?.updatedBy || "");

    if (!action || !dealId) {
      return res.status(400).json({
        message: "Need action + objectId",
        received: { query: req.query || {}, body: req.body || {} },
      });
    }

    const hubspotToken = process.env.HUBSPOT_TOKEN;
    if (!hubspotToken)
      return res.status(500).json({ message: "Missing HUBSPOT_TOKEN secret" });

    // ---- FAST GET ----
    if (action === "get") {
      const meta = await withTimeout(
        hubspotGetDealFeeSheetMeta(dealId, hubspotToken),
        8000,
        "HubSpot get timeout"
      );

      return res.json({
        feeSheetUrl: meta.feeSheetUrl || "",
        feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
        feeSheetFileName: meta.feeSheetFileName || "",
        lastUpdatedAt: "", // unchanged here; you can re-add SharePoint meta later if you want
        spCreatedAt: meta.feeSheetCreatedAt || "",
        spLastModifiedAt: "",
        readyForProposal: Boolean(meta.readyForProposal),
        readyBy: meta.readyBy || "",
        readyAt: meta.readyAt || "",
        feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
        message: meta.feeSheetUrl ? "Loaded ✅" : "No fee sheet saved yet",
      });
    }

    // ---- READY ----
    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      console.log("[set-ready] called", { dealId, next, by });

      let lineItemChanges = [];
      let lineItemSummary = { created: 0, updated: 0, deleted: 0, skipped: 0 };
      let debugSample = null;

      if (next) {
        const result = await upsertInputDbLineItems({ dealId, hubspotToken });
        lineItemChanges = result.changes;
        lineItemSummary = result.summary;
        debugSample = result.debugSample;
      }

      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_by: by,
        fee_sheet_ready_at: toIsoNow(),
      });

      return res.json({
        message: next
          ? `Ready status updated ✅ (line items: +${lineItemSummary.created} / ~${lineItemSummary.updated} / -${lineItemSummary.deleted})`
          : "Ready status updated ✅",
        readyForProposal: next,
        lineItemSummary,
        lineItemChanges,
        debugSample,
      });
    }

    return res.status(400).json({ message: `Unknown action: ${action}` });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err?.message || String(err),
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on " + PORT));
