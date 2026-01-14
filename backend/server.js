/**
 * server.js (FULL FILE REPLACEMENT)
 *
 * - action=get...action=set-ready (ready=true):
 *    reads Input-DB!B15:B160 + Input-DB!AC16:AC160 from the SharePoint-hosted Excel fee sheet
 *    and upserts HubSpot line items keyed by fee_sheet_key = INPUT_DB_ROW_<row>.
 *
 * - action=set-ready (ready=true) ALSO:
 *    reads Summary!J7 from the same fee sheet and writes it to the deal's "amount" property.
 *
 * - action=set-ready (ready=false):
 *    only updates the ready properties on the deal (does not touch line items or amount).
 *
 * - action=sync-line-items:
 *    runs the same line item sync without toggling ready.
 *
 * Notes:
 * - Requires env vars for HubSpot + Microsoft Graph auth (see below).
 */

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ---------------------------
// Env / constants
// ---------------------------

const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN || "";
const MS_TENANT_ID = process.env.MS_TENANT_ID || "";
const MS_CLIENT_ID = process.env.MS_CLIENT_ID || "";
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET || "";

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

// ---------------------------
// HubSpot helpers
// ---------------------------

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
  } catch (e) {
    // non-json response
  }

  if (!res.ok) {
    const msg = json?.message || text || `HubSpot error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json;
}

async function hubspotPatchDeal(dealId, token, properties) {
  return hsFetch(`/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    token,
    body: { properties },
  });
}

async function hubspotGetDealFeeSheetMeta(dealId, token) {
  // Pull only the properties we care about
  const props = [
    "fee_sheet_url",
    "fee_sheet_drive_id",
    "fee_sheet_item_id",
    "fee_sheet_last_synced_at",
    "fee_sheet_ready_for_proposal",
    "fee_sheet_ready_by",
    "fee_sheet_ready_at",
    "fee_sheet_file_name",
    "fee_sheet_created_by",
    "fee_sheet_created_at",
    "fee_sheet_last_synced_by",
    "fee_sheet_last_synced_at",
  ];

  const data = await hsFetch(
    `/crm/v3/objects/deals/${dealId}?properties=${encodeURIComponent(
      props.join(",")
    )}`,
    { token }
  );

  const p = data?.properties || {};
  return {
    feeSheetUrl: p.fee_sheet_url || "",
    feeSheetDriveId: p.fee_sheet_drive_id || "",
    feeSheetItemId: p.fee_sheet_item_id || "",
    fileName: p.fee_sheet_file_name || "",
    createdBy: p.fee_sheet_created_by || "",
    createdAt: p.fee_sheet_created_at || "",
    lastSyncedBy: p.fee_sheet_last_synced_by || "",
    lastSyncedAt: p.fee_sheet_last_synced_at || "",
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
  } catch (e) {}

  if (!res.ok) {
    const msg = json?.error?.message || text || `Graph error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json;
}

// Graph: resolve a SharePoint/OneDrive “share link” to a driveItem
async function graphGetDriveItemFromShareLink(accessToken, shareUrl) {
  // Encode URL into Graph sharing token format
  // https://learn.microsoft.com/en-us/graph/api/shares-get?view=graph-rest-1.0
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

// Graph: read a range
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

// ---------------------------
// NEW: Summary!J7 => Deal amount
// ---------------------------

// When "Ready for proposal" is clicked, pull Summary!J7 from the fee sheet and (optionally)
// write it to the HubSpot deal's "amount" property.
async function getSummaryJ7Amount({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
  if (!meta?.feeSheetUrl)
    throw new Error("No fee sheet URL found on this deal.");

  const accessToken = await getMsAccessToken();

  // Prefer cached IDs stored on the deal, resolve from share link if missing.
  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    // Persist for faster future reads
    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  // Read Summary!J7
  const values = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Summary",
    "J7"
  );
  const raw = getCell(values, 0, 0);

  // If blank/null, don't overwrite the deal amount
  if (raw === null || raw === undefined || String(raw).trim() === "") {
    return { raw, amount: null };
  }

  const amount = toNumberOrZero(raw);
  return { raw, amount };
}

// ---------------------------
// Line item sync (Input-DB)
// ---------------------------

const INPUT_DB_NAME_RANGE = "B15:B160";
const INPUT_DB_PRICE_RANGE = "AC16:AC160";

// block starts (row ranges) — NOTE: J7 request is separate, this is for line items only
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

async function hsSearchLineItemsByKey(token, feeSheetKey) {
  // Search line items by custom property "fee_sheet_key"
  // If your portal uses a different internal property name, update here.
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "fee_sheet_key",
            operator: "EQ",
            value: feeSheetKey,
          },
        ],
      },
    ],
    properties: ["fee_sheet_key", "price", "name"],
    limit: 10,
  };

  const json = await hsFetch(`/crm/v3/objects/line_items/search`, {
    method: "POST",
    token,
    body,
  });

  return json?.results || [];
}

async function hsCreateLineItem(token, props) {
  return hsFetch(`/crm/v3/objects/line_items`, {
    method: "POST",
    token,
    body: { properties: props },
  });
}

async function hsUpdateLineItem(token, lineItemId, props) {
  return hsFetch(`/crm/v3/objects/line_items/${lineItemId}`, {
    method: "PATCH",
    token,
    body: { properties: props },
  });
}

async function hsDeleteLineItem(token, lineItemId) {
  return hsFetch(`/crm/v3/objects/line_items/${lineItemId}`, {
    method: "DELETE",
    token,
  });
}

async function hsAssociateLineItemToDeal(token, dealId, lineItemId) {
  // v4 association endpoint
  return hsFetch(
    `/crm/v4/objects/deals/${dealId}/associations/line_items/${lineItemId}/deal_to_line_item`,
    { method: "PUT", token }
  );
}

function getBlockFallbackName(namesValues, blockStartRow) {
  // namesValues corresponds to B15..B160 (indexes 0..145)
  // For row r, index = r - 15.
  const headerRow = blockStartRow - 1; // e.g. block 16..25 => header is row 15
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

  const accessToken = await getMsAccessToken();

  // Use cached driveId/itemId if present; otherwise resolve from share link
  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.driveId;
    itemId = resolved.itemId;

    // Persist back to deal for future speed
    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_drive_id: driveId,
      fee_sheet_item_id: itemId,
    });
  }

  // Read Input-DB ranges
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

  // debug sample (kept intentionally small)
  const debugSample = {
    B15: getCell(namesValues, 0, 0),
    B16: getCell(namesValues, 1, 0),
    AC16: getCell(priceValues, 0, 0),
  };

  // Build a quick map row => price
  const priceByRow = new Map();
  // priceValues is AC16..AC160 (rows 16..160 => 145 rows)
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

      // Find existing line item by key
      const existing = await hsSearchLineItemsByKey(hubspotToken, feeSheetKey);
      const existingItem = existing?.[0] || null;

      if (!shouldExist) {
        // If no price, delete existing item if present; otherwise skip
        if (existingItem?.id) {
          await hsDeleteLineItem(hubspotToken, existingItem.id);
          summary.deleted += 1;
          changes.push({ row: r, key: feeSheetKey, action: "deleted" });
        } else {
          summary.skipped += 1;
          changes.push({ row: r, key: feeSheetKey, action: "skipped" });
        }
        continue;
      }

      // should exist => create or update
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

  // Persist "last synced" info
  await hubspotPatchDeal(dealId, hubspotToken, {
    fee_sheet_last_synced_at: toIsoNow(),
    fee_sheet_last_synced_by: "Fee Sheet Backend",
  });

  return { changes, summary, debugSample };
}

// ---------------------------
// Routes
// ---------------------------

app.get("/", (req, res) => {
  res.send("Fee Sheet backend is running.");
});

app.all("/api/fee-sheet", async (req, res) => {
  try {
    const hubspotToken = HUBSPOT_TOKEN;
    if (!hubspotToken) {
      return res
        .status(500)
        .json({ message: "Missing HUBSPOT_PRIVATE_APP_TOKEN env var." });
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

    // --- action=get: return current deal fee sheet meta
    if (action === "get") {
      const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
      return res.json({
        message: "ok",
        meta,
      });
    }

    // --- action=sync-line-items: run line item sync without toggling ready
    if (action === "sync-line-items" || action === "syncLineItems") {
      const result = await upsertInputDbLineItems({ dealId, hubspotToken });
      return res.json({
        message: `Line items synced ✅ (+${result.summary.created} ~${result.summary.updated} -${result.summary.deleted}, skipped ${result.summary.skipped})`,
        lineItemSummary: result.summary,
        lineItemChanges: result.changes,
        debugSample: result.debugSample,
      });
    }

    // --- action=set-ready: toggle ready, optionally sync items + deal amount when setting ready=true
    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      console.log("[set-ready] called", { dealId, next, by });

      let lineItemChanges = [];
      let lineItemSummary = { created: 0, updated: 0, deleted: 0, skipped: 0 };
      let debugSample = null;

      // NEW: pull Summary!J7 and (when ready=true) write it to the deal's amount
      let summaryAmount = null;

      if (next) {
        const result = await upsertInputDbLineItems({ dealId, hubspotToken });
        lineItemChanges = result.changes;
        lineItemSummary = result.summary;
        debugSample = result.debugSample;

        const j7 = await getSummaryJ7Amount({ dealId, hubspotToken });
        summaryAmount = j7.amount; // null if blank
      }

      const patchProps = {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_by: by,
        fee_sheet_ready_at: toIsoNow(),
      };

      // Only write amount when ready=true AND J7 was non-blank
      if (next && summaryAmount !== null) {
        patchProps.amount = String(summaryAmount);
      }

      await hubspotPatchDeal(dealId, hubspotToken, patchProps);

      return res.json({
        message: next
          ? `Ready status updated ✅ (new line items: ${lineItemSummary.created})`
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
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
