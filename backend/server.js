const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

app.get("/__version", (req, res) =>
  res.json({
    version: "DEPLOY_TEST_ALLISON",
    now: new Date().toISOString(),
  })
);

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
  // ✅ Expanded properties (includes drive/item ids + ready fields)
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
  ].join(",");

  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=${props}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
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
  };
}

async function getDealName(dealId, token) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=dealname`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (resp.status === 404) return `Deal ${dealId}`;

  if (!resp.ok) {
    throw new Error(`Failed to fetch deal name (${resp.status})`);
  }

  const json = await resp.json();
  return json?.properties?.dealname || `Deal ${dealId}`;
}

/**
 * ----------------------------
 * Microsoft Graph helpers
 * ----------------------------
 */

// ✅ Token cache to avoid slow token call on every refresh
let msTokenCache = {
  token: "",
  expiresAtMs: 0,
};

async function getMsAccessToken() {
  const now = Date.now();

  // Use cached token if it's still valid (with 60s buffer)
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
  if (!resp.ok) {
    throw new Error(
      `Microsoft token error: ${resp.status} ${JSON.stringify(json)}`
    );
  }

  const accessToken = json.access_token || "";
  const expiresInSec = Number(json.expires_in || 0);

  msTokenCache = {
    token: accessToken,
    expiresAtMs: Date.now() + Math.max(0, expiresInSec) * 1000,
  };

  return accessToken;
}

// Share link resolver (fallback for old deals that don't have drive/item ids saved)
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
  if (!monitorUrl) {
    throw new Error(
      "Graph copy did not return a monitor URL (location header)."
    );
  }

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
  // We expect Graph to give raw numbers for currency cells.
  // HubSpot likes numbers as strings. Skip blanks.
  if (v === null || v === undefined) return null;

  if (typeof v === "number") return String(v);

  const s = String(v).trim();
  if (!s) return null;

  // Remove commas and $ just in case formatted strings sneak in
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
     * If Graph is slow, return HubSpot-only fields and the card still loads.
     */
    if (action === "get") {
      const meta = await withTimeout(
        hubspotGetDealFeeSheetMeta(dealId, hubspotToken),
        5000,
        "HubSpot get timeout"
      );

      // Always send these so UI doesn't flicker / default wrong
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

        // Prefer IDs if available (faster/more reliable)
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

        // Fallback: resolve via share link (older deals)
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

    if (action === "set-ready") {
      const next = String(ready).toLowerCase() === "true";
      const by = updatedBy || createdBy || "Unknown user";

      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_ready_for_proposal: next ? "true" : "false",
        fee_sheet_ready_by: by,
        fee_sheet_ready_at: toIsoNow(),
      });

      return res.json({ message: "Ready status updated ✅", readyForProposal: next });
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

      // One fee sheet per deal: if it already exists in HubSpot, return it
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
        });
      }

      const accessToken = await getMsAccessToken();

      // Resolve template share link to a driveItem
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

      // Your exact naming rule:
      const fileName = `${safeDealName} - Fee Sheet Template-v05192025.xlsx`;

      // If file already exists in SharePoint folder, reuse it (prevents 409)
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
        if (!existingShareUrl) {
          throw new Error("Found existing file but could not create share link.");
        }

        const createdAtMs = Date.now();

        // ✅ Store driveId + itemId on the Deal
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
        });
      }

      // Copy template and wait for new file
      const newItem = await graphCopyDriveItemAndWait(
        accessToken,
        parent.driveId,
        templateItem.id,
        parent.id,
        fileName
      );

      // Create share link
      const shareUrl = await graphCreateShareLink(
        accessToken,
        parent.driveId,
        newItem.id
      );
      if (!shareUrl)
        throw new Error("Could not create SharePoint share link for new file.");

      const createdAtMs = Date.now();

      // ✅ Store driveId + itemId on the Deal
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
      });
    }

    /**
     * ----------------------------
     * NEW: action=refresh
     * Reads Summary sheet cells and updates Deal properties (one-way Excel -> HubSpot)
     * ----------------------------
     */
    if (action === "refresh") {
      const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

      if (!meta?.feeSheetUrl) {
        return res
          .status(400)
          .json({ message: "No fee sheet URL found on this deal." });
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
          // save for next time (migration)
          await hubspotPatchDeal(dealId, hubspotToken, {
            fee_sheet_drive_id: driveId,
            fee_sheet_item_id: itemId,
          });
        }
      }

      if (!driveId || !itemId) {
        throw new Error("Could not determine driveId/itemId for fee sheet.");
      }

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

      // Flatten helpers (Graph returns 2D arrays)
      const getCell = (values2d, r, c) =>
        Array.isArray(values2d) && Array.isArray(values2d[r])
          ? values2d[r][c]
          : null;

      // Map E13..E22 (rows 0..9)
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

      // Only send non-null numeric fields; send text always (empty ok)
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

      await hubspotPatchDeal(dealId, hubspotToken, propertiesToPatch);

      return res.json({
        message: "Synced values from Fee Sheet → HubSpot ✅",
        updated: propertiesToPatch,
      });
    }

    // ✅ This must be LAST
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

