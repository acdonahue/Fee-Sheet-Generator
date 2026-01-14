/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * backend/server.js (FULL FILE REPLACEMENT — CommonJS for Render)
 *
 * Behavior:
 * - action=get:
 *    returns deal fee sheet meta
 * - action=set-ready (ready=true):
 *    1) sync line items from Input-DB
 *    2) read Summary!J7 and write it to deal property "amount"
 *    3) set ready properties on the deal
 * - action=set-ready (ready=false):
 *    only sets ready properties (does not touch line items or amount)
 * - action=sync-line-items:
 *    sync line items without toggling ready
 */

// CommonJS imports (Render default)
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
  } catch {
    // Non-JSON response; keep json as null
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

// Resolve a SharePoint/OneDrive “share link” to a driveItem
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

// Read a range
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

  // If blank/null, don't overwrite deal amount
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
  const body = {
    filterGroups: [
      {
        filters: [
          { propertyName: "fee_sheet_key", operator: "EQ", value: feeSheetKey },
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
  return hsFetch(
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

      const existing = await hsSearchLineItemsByKey(hubspotToken, feeSheetKey);
      const existingItem = existing?.[0] || null;

      if (!shouldExist) {
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

    if (action === "get") {
      const meta = await hubspotGetDealFeeSheetMeta(dealId, HUBSPOT_TOKEN);
      return res.json({ message: "ok", meta });
    }

    if (action === "sync-line-items" || action === "syncLineItems") {
      const result = await upsertInputDbLineItems({
        dealId,
        hubspotToken: HUBSPOT_TOKEN,
      });
      return res.json({
        message: `Line items synced ✅ (+${result.summary.created} ~${result.summary.updated} -${result.summary.deleted}, skipped ${result.summary.skipped})`,
        lineItemSummary: result.summary,
        lineItemChanges: result.changes,
        debugSample: result.debugSample,
      });
    }

    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      let lineItemChanges = [];
      let lineItemSummary = { created: 0, updated: 0, deleted: 0, skipped: 0 };
      let debugSample = null;

      let summaryAmount = null;

      // Only do the expensive stuff when setting ready=true
      if (next) {
        const result = await upsertInputDbLineItems({
          dealId,
          hubspotToken: HUBSPOT_TOKEN,
        });
        lineItemChanges = result.changes;
        lineItemSummary = result.summary;
        debugSample = result.debugSample;

        const j7 = await getSummaryJ7Amount({
          dealId,
          hubspotToken: HUBSPOT_TOKEN,
        });
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

      await hubspotPatchDeal(dealId, HUBSPOT_TOKEN, patchProps);

      return res.json({
        message: next
          ? `Ready status updated ✅ (line items +${lineItemSummary.created} ~${lineItemSummary.updated} -${lineItemSummary.deleted})`
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

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
