/**
 * server.js (FULL FILE)
 * Adds: Deal property -> Line Item upsert when action=set-ready and ready=true
 *
 * YOU MUST EDIT / FILL OUT:
 *   (A) LINE_ITEM_RULES productSku values
 *   (B) AUTO_REFRESH_BEFORE_READY (true/false)
 *   (C) Ensure HubSpot line item property "fee_sheet_key" exists (recommended)
 */

const express = require("express");
const cors = require("cors");

const app = express();
const DEAL_TO_LINE_ITEM_ASSOC_TYPE_ID = 19;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

app.get("/__version", (req, res) =>
  res.json({
    version: "ASSOC_V3_TYPEID_19_2026-01-12b",
    now: new Date().toISOString(),
  })
);

/**
 * ----------------------------
 * YOU MUST EDIT THIS
 * ----------------------------
 * If true, clicking "Ready for proposal" will:
 *   1) run the Excel -> Deal property refresh (your existing logic)
 *   2) then generate line items
 *
 * If false, "Ready" will only generate line items based on whatever values
 * are already on the Deal (requires user to click Refresh first, or values to be current).
 */
const AUTO_REFRESH_BEFORE_READY = true;

/**
 * ----------------------------
 * YOU MUST EDIT THIS
 * ----------------------------
 * Mapping of deal totals properties -> HubSpot products (by SKU) -> Deal line items.
 *
 * - key: stable id used to find/update/delete the generated line item
 * - dealProp: internal name of the Deal property that contains the numeric total
 * - productSku: SKU of the HubSpot Product in your Product Library
 * - quantity: usually 1 for a flat fee
 *
 * IMPORTANT:
 * - This implementation expects you to create a Line Item custom property:
 *     Internal name: fee_sheet_key
 *     Type: single-line text
 *   so we can safely upsert without duplicates.
 */
const LINE_ITEM_RULES = [
  {
    key: "FEAS-PREDESIGN",
    dealProp: "feas_totals",
    productSku: "FEAS-PREDESIGN",
    quantity: 1,
  },
  {
    key: "SURVEY-ASBUILT",
    dealProp: "survey_totals",
    productSku: "SURVEY-ASBUILT",
    quantity: 1,
  },
  {
    key: "SP-SCHEMATIC",
    dealProp: "schematic_totals",
    productSku: "SP-SCHEMATIC",
    quantity: 1,
  },
  {
    key: "ZONING-DWGS",
    dealProp: "zoning_totals",
    productSku: "ZONING-DWGS",
    quantity: 1,
  },
  {
    key: "CONSTR-DOCS",
    dealProp: "constr_docs_totals",
    productSku: "CONSTR-DOCS",
    quantity: 1,
  },
  {
    key: "FFE",
    dealProp: "ffe_totals",
    productSku: "FFE",
    quantity: 1,
  },
  {
    key: "BIDDING",
    dealProp: "bid_totals",
    productSku: "BIDDING",
    quantity: 1,
  },
  {
    key: "PERMITTING",
    dealProp: "permit_totals",
    productSku: "PERMITTING",
    quantity: 1,
  },
  {
    key: "CONSTR-ADMIN",
    dealProp: "constr_admin_totals",
    productSku: "CONSTR-ADMIN",
    quantity: 1,
  },
  {
    key: "PHASE-10",
    dealProp: "phase_10_totals",
    productSku: "PHASE-10",
    quantity: 1,
  },
];

/**
 * ----------------------------
 * Small helpers
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

async function hubspotGetDealProperties(dealId, token, properties) {
  const props = properties.join(",");
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=${encodeURIComponent(
      props
    )}`,
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to fetch deal properties: ${resp.status} ${text}`);
  }

  const json = await resp.json();
  return json?.properties || {};
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

async function getDealName(dealId, token) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname`,
    { method: "GET", headers: { Authorization: `Bearer ${token}` } }
  );

  if (resp.status === 404) return `Deal ${dealId}`;
  if (!resp.ok) throw new Error(`Failed to fetch deal name (${resp.status})`);

  const json = await resp.json();
  return json?.properties?.dealname || `Deal ${dealId}`;
}

/**
 * ---- Line Item helpers ----
 * Uses:
 *  - Product lookup by SKU (cached)
 *  - Deal -> line item associations
 *  - Batch read of line items
 *  - Create/update/delete line items
 */
const productIdCache = new Map(); // sku -> productId

async function hubspotFindProductIdBySku(token, sku) {
  const s = String(sku || "").trim();
  if (!s) return "";
  if (productIdCache.has(s)) return productIdCache.get(s);

  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/products/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filterGroups: [
          { filters: [{ propertyName: "hs_sku", operator: "EQ", value: s }] },
        ],
        properties: ["hs_sku", "name"],
        limit: 1,
      }),
    }
  );

  const text = await resp.text();
  if (!resp.ok)
    throw new Error(`Product search failed ${resp.status}: ${text}`);

  const json = safeJsonParse(text);
  const first = Array.isArray(json?.results) ? json.results[0] : null;
  const id = first?.id || "";

  if (id) productIdCache.set(s, id);
  return id;
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

// ✅ MUST MATCH YOUR labels result:
const DEAL_TO_LINE_ITEM_ASSOC_TYPE_ID = 19;

async function hubspotAssociateLineItemToDeal(lineItemId, dealId, token) {
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/line_items/${lineItemId}/${DEAL_TO_LINE_ITEM_ASSOC_TYPE_ID}`;

  console.log("ASSOC ATTEMPT", {
    dealId,
    lineItemId,
    url,
    typeId: DEAL_TO_LINE_ITEM_ASSOC_TYPE_ID,
  });

  const resp = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(
      `Associate line item failed ${resp.status}: ${
        text || "(empty body)"
      } | url=${url}`
    );
  }
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
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Delete line item failed ${resp.status}: ${text}`);
  }
}

/**
 * Upsert fee sheet-driven line items based on deal totals properties.
 *
 * Requires line item property "fee_sheet_key" (recommended).
 * Behavior:
 *  - If amount <= 0: delete existing generated line item for that key
 *  - If amount > 0: create or update the generated line item
 */
async function upsertFeeSheetLineItems({ dealId, token }) {
  // 1) read the totals from the deal
  const dealProps = await hubspotGetDealProperties(
    dealId,
    token,
    LINE_ITEM_RULES.map((r) => r.dealProp)
  );

  // 2) read existing line items on deal
  const ids = await hubspotListLineItemIdsForDeal(dealId, token);

  // We rely on fee_sheet_key to find items reliably.
  const existing = await hubspotBatchReadLineItems(token, ids, [
    "fee_sheet_key",
    "hs_product_id",
    "price",
    "quantity",
  ]);

  const byKey = new Map();
  for (const li of existing) {
    const k = li?.properties?.fee_sheet_key;
    if (k) byKey.set(String(k), li);
  }

  const changes = [];

  for (const rule of LINE_ITEM_RULES) {
    const amount = toNumberOrZero(dealProps?.[rule.dealProp]);
    const shouldExist = amount > 0;

    const existingLi = byKey.get(rule.key);

    if (!shouldExist) {
      if (existingLi?.id) {
        await hubspotDeleteLineItem(String(existingLi.id), token);
        changes.push({ key: rule.key, action: "deleted", amount });
      } else {
        changes.push({ key: rule.key, action: "skipped", amount });
      }
      continue;
    }

    const productId = await hubspotFindProductIdBySku(token, rule.productSku);
    if (!productId) {
      throw new Error(
        `No product found for SKU "${rule.productSku}" (rule key: ${rule.key})`
      );
    }

    const props = {
      hs_product_id: String(productId),
      quantity: String(rule.quantity ?? 1),
      price: String(amount),
      fee_sheet_key: rule.key, // requires your custom line item property
    };

    if (existingLi?.id) {
      await hubspotUpdateLineItem(String(existingLi.id), token, props);
      changes.push({ key: rule.key, action: "updated", amount });
    } else {
      const created = await hubspotCreateLineItem(token, props);
      const newId = created?.id;
      if (!newId)
        throw new Error(
          `Line item create returned no id for rule key: ${rule.key}`
        );

      await hubspotAssociateLineItemToDeal(String(newId), dealId, token);
      changes.push({ key: rule.key, action: "created", amount });
    }
  }

  return changes;
}

/**
 * ----------------------------
 * Microsoft Graph helpers
 * (Unchanged from your version)
 * ----------------------------
 */
let msTokenCache = { token: "", expiresAtMs: 0 };

async function getMsAccessToken() {
  const now = Date.now();
  if (msTokenCache.token && msTokenCache.expiresAtMs - 60_000 > now)
    return msTokenCache.token;

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

async function graphGetDriveItemMetaByIds(accessToken, driveId, itemId) {
  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}?$select=name,webUrl,lastModifiedDateTime,createdDateTime`
  );

  return {
    name: json?.name || "",
    webUrl: json?.webUrl || "",
    lastModifiedDateTime: json?.lastModifiedDateTime || "",
    createdDateTime: json?.createdDateTime || "",
  };
}

async function graphCreateShareLink(accessToken, driveId, itemId) {
  const scope = process.env.SHARE_LINK_SCOPE || "organization";
  const type = "view";

  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/createLink`,
    {
      method: "POST",
      body: JSON.stringify({ type, scope }),
    }
  );

  return json?.link?.webUrl || "";
}

async function graphFindChildByName(accessToken, driveId, parentId, fileName) {
  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${parentId}/children?$select=id,name,webUrl`
  );

  const items = Array.isArray(json?.value) ? json.value : [];
  return (
    items.find(
      (it) => (it?.name || "").toLowerCase() === fileName.toLowerCase()
    ) || null
  );
}

async function graphCopyDriveItemAndWait(
  accessToken,
  driveId,
  itemId,
  parentId,
  newName
) {
  const { resp } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/copy`,
    {
      method: "POST",
      body: JSON.stringify({
        name: newName,
        parentReference: { id: parentId },
      }),
    }
  );

  const monitorUrl = resp.headers.get("location");
  if (!monitorUrl)
    throw new Error(
      "Graph copy did not return a monitor URL (location header)."
    );

  const maxMs = 60_000;
  const start = Date.now();

  while (Date.now() - start < maxMs) {
    const check = await fetch(monitorUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (check.status === 202) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }

    const text = await check.text();
    const json = safeJsonParse(text);

    if (check.ok) {
      if (json?.id) return json;
      throw new Error(`Copy finished but no item id returned: ${text}`);
    }

    throw new Error(`Copy monitor failed ${check.status}: ${text}`);
  }

  throw new Error("Timed out waiting for SharePoint copy to finish.");
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

function normalizeCurrencyValue(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return String(v);

  const s = String(v).trim();
  if (!s) return null;

  const cleaned = s.replace(/[$,]/g, "").trim();
  if (!cleaned) return null;

  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;

  return String(n);
}

function normalizeTextValue(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

/**
 * ----------------------------
 * Reusable refresh routine
 * (This is your existing refresh logic, moved into a function so set-ready can call it.)
 * ----------------------------
 */
async function refreshDealFromFeeSheet({ dealId, hubspotToken }) {
  const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

  if (!meta?.feeSheetUrl) {
    throw new Error("No fee sheet URL found on this deal.");
  }

  const accessToken = await getMsAccessToken();

  // Prefer stored IDs; fallback to resolving share link for older deals
  let driveId = meta.feeSheetDriveId || "";
  let itemId = meta.feeSheetItemId || "";

  if (!driveId || !itemId) {
    const resolved = await graphGetDriveItemFromShareLink(
      accessToken,
      meta.feeSheetUrl
    );
    driveId = resolved.parentDriveId || "";
    itemId = resolved.id || "";

    if (driveId && itemId) {
      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_drive_id: driveId,
        fee_sheet_item_id: itemId,
      });
    }
  }

  if (!driveId || !itemId)
    throw new Error("Could not determine driveId/itemId for fee sheet.");

  // Read ranges from Summary tab
  const totalsValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Summary",
    "E13:E22"
  );
  const amountValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Summary",
    "J7:J7"
  );
  const titleValues = await graphGetRangeValues(
    accessToken,
    driveId,
    itemId,
    "Summary",
    "C22:C22"
  );

  const getCell = (values2d, r, c) =>
    Array.isArray(values2d) && Array.isArray(values2d[r])
      ? values2d[r][c]
      : null;

  const mapped = {
    feas_totals: normalizeCurrencyValue(getCell(totalsValues, 0, 0)),
    survey_totals: normalizeCurrencyValue(getCell(totalsValues, 1, 0)),
    schematic_totals: normalizeCurrencyValue(getCell(totalsValues, 2, 0)),
    zoning_totals: normalizeCurrencyValue(getCell(totalsValues, 3, 0)),
    constr_docs_totals: normalizeCurrencyValue(getCell(totalsValues, 4, 0)),
    ffe_totals: normalizeCurrencyValue(getCell(totalsValues, 5, 0)),
    bid_totals: normalizeCurrencyValue(getCell(totalsValues, 6, 0)),
    permit_totals: normalizeCurrencyValue(getCell(totalsValues, 7, 0)),
    constr_admin_totals: normalizeCurrencyValue(getCell(totalsValues, 8, 0)),
    phase_10_totals: normalizeCurrencyValue(getCell(totalsValues, 9, 0)),
    amount: normalizeCurrencyValue(getCell(amountValues, 0, 0)),
    phase_10_title: normalizeTextValue(getCell(titleValues, 0, 0)),
  };

  const propertiesToPatch = {
    phase_10_title: mapped.phase_10_title,
  };

  const numericKeys = [
    "feas_totals",
    "survey_totals",
    "schematic_totals",
    "zoning_totals",
    "constr_docs_totals",
    "ffe_totals",
    "bid_totals",
    "permit_totals",
    "constr_admin_totals",
    "phase_10_totals",
    "amount",
  ];

  for (const k of numericKeys) {
    if (mapped[k] !== null) propertiesToPatch[k] = mapped[k];
  }

  const nowIso = toIsoNow();

  await hubspotPatchDeal(dealId, hubspotToken, {
    ...propertiesToPatch,
    fee_sheet_last_synced_at: nowIso,
  });

  return { updated: propertiesToPatch, feeSheetLastSyncedAt: nowIso };
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
    if (!hubspotToken) {
      return res.status(500).json({ message: "Missing HUBSPOT_TOKEN secret" });
    }

    /**
     * ✅ FAST GET: never let Graph slow down the response.
     */
    if (action === "get") {
      const meta = await withTimeout(
        hubspotGetDealFeeSheetMeta(dealId, hubspotToken),
        5000,
        "HubSpot get timeout"
      );

      const base = {
        feeSheetUrl: meta.feeSheetUrl || "",
        feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
        feeSheetFileName: meta.feeSheetFileName || "",
        lastUpdatedAt: "",
        spCreatedAt: meta.feeSheetCreatedAt || "",
        spLastModifiedAt: "",
        readyForProposal: Boolean(meta.readyForProposal),
        readyBy: meta.readyBy || "",
        readyAt: meta.readyAt || "",
        feeSheetLastSyncedAt: meta.feeSheetLastSyncedAt || "",
        message: "Loaded (fast) ✅",
      };

      if (!meta?.feeSheetUrl) {
        return res.json({
          ...base,
          feeSheetUrl: "",
          feeSheetCreatedBy: "",
          feeSheetFileName: "",
          spCreatedAt: "",
          message: "No fee sheet saved yet",
        });
      }

      try {
        const accessToken = await withTimeout(
          getMsAccessToken(),
          2500,
          "MS token timeout"
        );

        if (meta.feeSheetDriveId && meta.feeSheetItemId) {
          const sp = await withTimeout(
            graphGetDriveItemMetaByIds(
              accessToken,
              meta.feeSheetDriveId,
              meta.feeSheetItemId
            ),
            2500,
            "Graph meta timeout"
          );

          return res.json({
            ...base,
            feeSheetFileName: meta.feeSheetFileName || sp.name || "",
            lastUpdatedAt: sp.lastModifiedDateTime || "",
            spCreatedAt: meta.feeSheetCreatedAt || sp.createdDateTime || "",
            spLastModifiedAt: sp.lastModifiedDateTime || "",
            message: "Loaded ✅",
          });
        }

        const sp = await withTimeout(
          graphGetDriveItemFromShareLink(accessToken, meta.feeSheetUrl),
          2500,
          "Graph lookup timeout"
        );

        return res.json({
          ...base,
          feeSheetFileName: meta.feeSheetFileName || sp.name || "",
          lastUpdatedAt: sp.lastModifiedDateTime || "",
          spCreatedAt: meta.feeSheetCreatedAt || sp.createdDateTime || "",
          spLastModifiedAt: sp.lastModifiedDateTime || "",
          message: "Loaded ✅",
        });
      } catch {
        return res.json(base);
      }
    }

    /**
     * Accept BOTH action names (your UI currently sent "setReady" earlier)
     */
    if (action === "set-ready" || action === "setReady") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      let refreshResult = null;
      let lineItemChanges = [];

      if (next) {
        // Optional: refresh first to ensure deal props are current
        if (AUTO_REFRESH_BEFORE_READY) {
          refreshResult = await refreshDealFromFeeSheet({
            dealId,
            hubspotToken,
          });
        }

        // Generate deal line items from deal totals
        lineItemChanges = await upsertFeeSheetLineItems({
          dealId,
          token: hubspotToken,
        });
      }

      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_by: by,
        fee_sheet_ready_at: toIsoNow(),
      });

      return res.json({
        message: next
          ? "Ready status updated ✅ (pricing generated)"
          : "Ready status updated ✅",
        readyForProposal: next,
        ...(refreshResult ? { refreshResult } : {}),
        lineItemChanges,
      });
    }

    if (action === "create") {
      const TEMPLATE_SHARE_LINK = process.env.TEMPLATE_SHARE_LINK;
      if (!TEMPLATE_SHARE_LINK) {
        return res.status(500).json({
          message:
            "Missing TEMPLATE_SHARE_LINK env var (SharePoint template share URL)",
        });
      }

      const createdBySafe = createdBy || "Unknown user";

      const existing = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
      if (existing?.feeSheetUrl) {
        return res.json({
          message: "Fee sheet already exists — using saved link ✅",
          feeSheetUrl: existing.feeSheetUrl || "",
          feeSheetCreatedBy: existing.feeSheetCreatedBy || "",
          feeSheetFileName: existing.feeSheetFileName || "Fee Sheet",
          lastUpdatedAt: "",
          spCreatedAt: existing.feeSheetCreatedAt || "",
          spLastModifiedAt: "",
          readyForProposal: Boolean(existing.readyForProposal),
          feeSheetLastSyncedAt: existing.feeSheetLastSyncedAt || "",
        });
      }

      const accessToken = await getMsAccessToken();

      const templateShareId = shareLinkToShareId(TEMPLATE_SHARE_LINK);
      const { json: templateItem } = await graphJson(
        accessToken,
        `https://graph.microsoft.com/v1.0/shares/${templateShareId}/driveItem`
      );

      const parent = templateItem?.parentReference;
      if (!parent?.driveId || !parent?.id) {
        throw new Error(
          "Could not determine template folder (parentReference missing)."
        );
      }

      const dealName = await getDealName(dealId, hubspotToken);
      const safeDealName = String(dealName)
        .replace(/[\\/:*?"<>|]/g, "-")
        .trim();

      const fileName = `${safeDealName} - Fee Sheet Template-v05192025.xlsx`;

      const existingItem = await graphFindChildByName(
        accessToken,
        parent.driveId,
        parent.id,
        fileName
      );

      if (existingItem?.id) {
        const existingShareUrl = await graphCreateShareLink(
          accessToken,
          parent.driveId,
          existingItem.id
        );
        if (!existingShareUrl)
          throw new Error(
            "Found existing file but could not create share link."
          );

        const createdAtMs = Date.now();

        await hubspotPatchDeal(dealId, hubspotToken, {
          fee_sheet_url: existingShareUrl,
          fee_sheet_created_by: createdBySafe,
          fee_sheet_created_at: String(createdAtMs),
          fee_sheet_file_name: fileName,
          fee_sheet_drive_id: parent.driveId,
          fee_sheet_item_id: existingItem.id,
        });

        return res.json({
          message: "Fee sheet already existed — linked it ✅",
          feeSheetUrl: existingShareUrl,
          feeSheetCreatedBy: createdBySafe,
          feeSheetFileName: fileName,
          lastUpdatedAt: "",
          spCreatedAt: String(createdAtMs),
          spLastModifiedAt: "",
          readyForProposal: false,
          feeSheetLastSyncedAt: "",
        });
      }

      const newItem = await graphCopyDriveItemAndWait(
        accessToken,
        parent.driveId,
        templateItem.id,
        parent.id,
        fileName
      );

      const shareUrl = await graphCreateShareLink(
        accessToken,
        parent.driveId,
        newItem.id
      );
      if (!shareUrl)
        throw new Error("Could not create SharePoint share link for new file.");

      const createdAtMs = Date.now();

      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_url: shareUrl,
        fee_sheet_created_by: createdBySafe,
        fee_sheet_created_at: String(createdAtMs),
        fee_sheet_file_name: fileName,
        fee_sheet_drive_id: parent.driveId,
        fee_sheet_item_id: newItem.id,
      });

      return res.json({
        message: "Fee sheet created ✅",
        feeSheetUrl: shareUrl,
        feeSheetCreatedBy: createdBySafe,
        feeSheetFileName: fileName,
        lastUpdatedAt: "",
        spCreatedAt: String(createdAtMs),
        spLastModifiedAt: "",
        readyForProposal: false,
        feeSheetLastSyncedAt: "",
      });
    }

    /**
     * action=refresh (unchanged externally, but now uses refreshDealFromFeeSheet())
     */
    if (action === "refresh") {
      const result = await refreshDealFromFeeSheet({ dealId, hubspotToken });
      return res.json({
        message: "Refreshed Deal values from Fee Sheet ✅",
        updated: result.updated,
        feeSheetLastSyncedAt: result.feeSheetLastSyncedAt,
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
