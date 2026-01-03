const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

// Fingerprint endpoint so you can confirm Render is running the right code
app.get("/__version", (req, res) =>
  res.json({
    version: "REAL_BACKEND_2026-01-02",
    now: new Date().toISOString(),
  })
);

/**
 * ----------------------------
 * HubSpot helpers
 * ----------------------------
 */
async function hubspotPatchDeal(dealId, token, properties) {
  const resp = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HubSpot update failed: ${resp.status} ${text}`);
  }
}

async function hubspotGetDealFeeSheetMeta(dealId, token) {
  const resp = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals/${dealId}?properties=fee_sheet_url,fee_sheet_created_by,fee_sheet_created_at,fee_sheet_file_name`,
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
    };
  }

  const json = await resp.json();
  return {
    feeSheetUrl: json?.properties?.fee_sheet_url || "",
    feeSheetCreatedAt: json?.properties?.fee_sheet_created_at || "",
    feeSheetCreatedBy: json?.properties?.fee_sheet_created_by || "",
    feeSheetFileName: json?.properties?.fee_sheet_file_name || "",
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
async function getMsAccessToken() {
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
  if (!resp.ok) throw new Error(`Microsoft token error: ${resp.status} ${JSON.stringify(json)}`);
  return json.access_token;
}

// Converts a SharePoint sharing link into a Graph "shareId"
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
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!resp.ok) throw new Error(`Graph error ${resp.status}: ${text}`);
  return { resp, json, text };
}

// Fetch file metadata from a SharePoint share link
async function graphGetDriveItemMetaFromShareLink(accessToken, shareLink) {
  const shareId = shareLinkToShareId(shareLink);

  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem?$select=name,webUrl,lastModifiedDateTime,createdDateTime`
  );

  return {
    name: json?.name || "",
    webUrl: json?.webUrl || "",
    lastModifiedDateTime: json?.lastModifiedDateTime || "",
    createdDateTime: json?.createdDateTime || "",
  };
}

// Create a share link for a drive item
async function graphCreateShareLink(accessToken, driveId, itemId) {
  const scope = process.env.SHARE_LINK_SCOPE || "organization"; // or "anonymous"
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

// Copy template drive item and wait until new item appears
async function graphCopyDriveItemAndWait(accessToken, driveId, itemId, parentId, newName) {
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
    throw new Error("Graph copy did not return a monitor URL (location header).");
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
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {}

    if (check.ok) {
      if (json?.id) return json;
      throw new Error(`Copy finished but no item id returned: ${text}`);
    }

    throw new Error(`Copy monitor failed ${check.status}: ${text}`);
  }

  throw new Error("Timed out waiting for SharePoint copy to finish.");
}

/**
 * ----------------------------
 * Main endpoint (GET/POST)
 * Matches your query-string NewCard.tsx
 * ----------------------------
 */
app.all("/api/fee-sheet", async (req, res) => {
  try {
    const action = String(req.query.action || req.body?.action || "");
    const dealId = String(req.query.objectId || req.body?.objectId || "");
    const createdBy = String(req.query.createdBy || req.body?.createdBy || "");

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

    // 1) GET action (card loads)
    if (action === "get") {
      const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

      if (meta?.feeSheetUrl) {
        try {
          const accessToken = await getMsAccessToken();
          const sp = await graphGetDriveItemMetaFromShareLink(accessToken, meta.feeSheetUrl);

          return res.json({
            feeSheetUrl: meta.feeSheetUrl || "",
            feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
            feeSheetFileName: meta.feeSheetFileName || sp.name || "",
            lastUpdatedAt: sp.lastModifiedDateTime || "",
            spCreatedAt: meta.feeSheetCreatedAt || sp.createdDateTime || "",
            spLastModifiedAt: sp.lastModifiedDateTime || "",
            message: "Loaded ✅",
          });
        } catch (e) {
          return res.json({
            feeSheetUrl: meta.feeSheetUrl || "",
            feeSheetCreatedBy: meta.feeSheetCreatedBy || "",
            feeSheetFileName: meta.feeSheetFileName || "",
            lastUpdatedAt: "",
            spCreatedAt: meta.feeSheetCreatedAt || "",
            spLastModifiedAt: "",
            message: "Loaded (HubSpot only; Graph unavailable)",
          });
        }
      }

      return res.json({
        feeSheetUrl: "",
        feeSheetCreatedBy: "",
        feeSheetFileName: "",
        lastUpdatedAt: "",
        spCreatedAt: "",
        spLastModifiedAt: "",
        message: "No fee sheet saved yet",
      });
    }

    // 2) CREATE action (button click)
    if (action === "create") {
      const TEMPLATE_SHARE_LINK = process.env.TEMPLATE_SHARE_LINK;
      if (!TEMPLATE_SHARE_LINK) {
        return res.status(500).json({
          message: "Missing TEMPLATE_SHARE_LINK env var (SharePoint template share URL)",
        });
      }

      const createdBySafe = createdBy || "Unknown user";

      // One fee sheet per deal: if it already exists, return it
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
        });
      }

      const accessToken = await getMsAccessToken();

      // Resolve the template share link to a driveItem
      const templateShareId = shareLinkToShareId(TEMPLATE_SHARE_LINK);
      const { json: templateItem } = await graphJson(
        accessToken,
        `https://graph.microsoft.com/v1.0/shares/${templateShareId}/driveItem`
      );

      const parent = templateItem?.parentReference;
      if (!parent?.driveId || !parent?.id) {
        throw new Error("Could not determine template folder (parentReference missing).");
      }

      const dealName = await getDealName(dealId, hubspotToken);
      const safeDealName = String(dealName).replace(/[\\/:*?"<>|]/g, "-").trim();
      const fileName = `Fee Sheet - ${safeDealName}.xlsx`;

      // Copy and wait for the new item
      const newItem = await graphCopyDriveItemAndWait(
        accessToken,
        parent.driveId,
        templateItem.id,
        parent.id,
        fileName
      );

      // Create a share link for the new file
      const shareUrl = await graphCreateShareLink(accessToken, parent.driveId, newItem.id);
      if (!shareUrl) throw new Error("Could not create SharePoint share link for new file.");

      // If your HubSpot property is date-only, midnight UTC is required.
      // If it's datetime, this still works.
      const now = new Date();
      const createdAtMidnightUtc = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      ).toISOString();

      await hubspotPatchDeal(dealId, hubspotToken, {
        fee_sheet_url: shareUrl,
        fee_sheet_created_by: createdBySafe,
        fee_sheet_created_at: createdAtMidnightUtc,
        fee_sheet_file_name: fileName,
      });

      return res.json({
        message: "Fee sheet created ✅",
        feeSheetUrl: shareUrl,
        feeSheetCreatedBy: createdBySafe,
        feeSheetFileName: fileName,
        lastUpdatedAt: "",
        spCreatedAt: createdAtMidnightUtc,
        spLastModifiedAt: "",
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

