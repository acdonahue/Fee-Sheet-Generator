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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch deal name (${resp.status})`);
  }

  const json = await resp.json();
  return json?.properties?.dealname || `Deal ${dealId}`;
}

async function getMsAccessToken() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing Microsoft secrets (MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET)");
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
  return { resp, json };
}

// Fetch file metadata (including lastModifiedDateTime) from a SharePoint share link
async function graphGetDriveItemMetaFromShareLink(accessToken, shareLink) {
  const shareId = shareLinkToShareId(shareLink);

  const { json } = await graphJson(
    accessToken,
    `https://graph.microsoft.com/v1.0/shares/${shareId}/driveItem?$select=name,webUrl,lastModifiedDateTime`
  );

  return {
    name: json?.name || "",
    webUrl: json?.webUrl || "",
    lastModifiedDateTime: json?.lastModifiedDateTime || "",
  };
}

exports.main = async (context = {}) => {
  const dealId = context?.propertiesToSend?.hs_object_id;
  const action = context?.parameters?.action || "get";

  const hubspotToken = process.env.HUBSPOT_TOKEN;
  if (!dealId) return { statusCode: 400, body: { message: "Missing deal id" } };
  if (!hubspotToken) return { statusCode: 500, body: { message: "Missing HUBSPOT_TOKEN secret" } };

  // 1) GET action (card loads)
  if (action === "get") {
    const meta = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);

    // If we have a fee sheet URL, pull "true last updated" from SharePoint (Graph)
    if (meta?.feeSheetUrl) {
      try {
        const accessToken = await getMsAccessToken();
        const sp = await graphGetDriveItemMetaFromShareLink(accessToken, meta.feeSheetUrl);

        return {
          statusCode: 200,
          body: {
            ...meta,
            // This is the real SharePoint "last updated"
            lastUpdatedAt: sp.lastModifiedDateTime || "",
            // Optional: if we never stored file name (older deals), use SharePoint name
            feeSheetFileName: meta.feeSheetFileName || sp.name || "",
          },
        };
      } catch (e) {
        // If Graph fails for any reason, still return what we have (card should still work)
        return {
          statusCode: 200,
          body: { ...meta, lastUpdatedAt: "" },
        };
      }
    }

    return { statusCode: 200, body: { ...meta, lastUpdatedAt: "" } };
  }

  // 2) CREATE action (button click)
  if (action === "create") {
    const TEMPLATE_SHARE_LINK =
      "https://designblendzllc.sharepoint.com/:x:/s/DesignblendzLLC/IQBqvzNphmJCS4M7zoQpHBNdAQATuGa7D73AWBzsvWlgCUw?e=sPbEZE";

    const createdBy = context?.parameters?.createdBy || "Unknown user";

    // If your HubSpot property is a date-only field, it requires midnight UTC.
    // (If it's a datetime field, this is still acceptable.)
    const now = new Date();
    const createdAtMidnightUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    ).toISOString();

    // ✅ One fee sheet per deal: if it already exists, return it (no new file)
    const existing = await hubspotGetDealFeeSheetMeta(dealId, hubspotToken);
    if (existing?.feeSheetUrl) {
      return {
        statusCode: 200,
        body: {
          message: "Fee sheet already exists — using saved link ✅",
          ...existing,
          // lastUpdatedAt will be fetched by the GET action on refresh
          lastUpdatedAt: "",
          feeSheetFileName: existing.feeSheetFileName || "Fee Sheet",
        },
      };
    }

    const accessToken = await getMsAccessToken();

    // A) Resolve the TEMPLATE share link to a driveItem
    const templateShareId = shareLinkToShareId(TEMPLATE_SHARE_LINK);
    const { json: item } = await graphJson(
      accessToken,
      `https://graph.microsoft.com/v1.0/shares/${templateShareId}/driveItem`
    );

    // B) Copy it into the SAME folder as the template
    const parent = item?.parentReference;
    if (!parent?.driveId || !parent?.id) {
      throw new Error("Could not determine template folder (parentReference missing).");
    }

    // Filename based on Deal Name (only used on first creation)
    const dealName = await getDealName(dealId, hubspotToken);
    const safeDealName = dealName.replace(/[<>:"/\\|?*]/g, "").trim();
    const newName = `${safeDealName} - Fee Sheet Template-v05192025.xlsx`;

    // Copy (async 202)
    await graphJson(
      accessToken,
      `https://graph.microsoft.com/v1.0/drives/${parent.driveId}/items/${item.id}/copy`,
      {
        method: "POST",
        body: JSON.stringify({
          name: newName,
          parentReference: { driveId: parent.driveId, id: parent.id },
        }),
      }
    );

    // C) Poll until the copied file shows up; capture its id + webUrl
    let newItemId = "";
    let webUrl = "";

    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 750));

      const { json: children } = await graphJson(
        accessToken,
        `https://graph.microsoft.com/v1.0/drives/${parent.driveId}/items/${parent.id}/children?$select=id,name,webUrl`
      );

      const found = (children?.value || []).find((x) => x.name === newName);
      if (found?.id) {
        newItemId = found.id;
        webUrl = found.webUrl || "";
        break;
      }
    }

    if (!newItemId) throw new Error("Copied file not found yet. Try again in a moment.");

    // D) Create an org-scoped “view” share link (best for opening from HubSpot)
    const { json: linkResp } = await graphJson(
      accessToken,
      `https://graph.microsoft.com/v1.0/drives/${parent.driveId}/items/${newItemId}/createLink`,
      {
        method: "POST",
        body: JSON.stringify({ type: "view", scope: "organization" }),
      }
    );

    const shareUrl = linkResp?.link?.webUrl || webUrl;
    if (!shareUrl) throw new Error("Could not generate a share link for the copied file.");

    // E) Save URL + created meta + file name back to the Deal
    await hubspotPatchDeal(dealId, hubspotToken, {
      fee_sheet_url: shareUrl,
      fee_sheet_created_by: createdBy,
      fee_sheet_created_at: createdAtMidnightUtc, // safe for date-only properties
      fee_sheet_file_name: newName,
    });

    // Also return SharePoint lastModifiedDateTime immediately (nice UX)
    let lastUpdatedAt = "";
    try {
      const sp = await graphGetDriveItemMetaFromShareLink(accessToken, shareUrl);
      lastUpdatedAt = sp.lastModifiedDateTime || "";
    } catch {
      // ok if it fails; GET will try again
    }

    return {
      statusCode: 200,
      body: {
        message: "Fee sheet created ✅",
        feeSheetUrl: shareUrl,
        feeSheetCreatedAt: createdAtMidnightUtc,
        feeSheetCreatedBy: createdBy,
        feeSheetFileName: newName,
        lastUpdatedAt,
      },
    };
  }

  return { statusCode: 400, body: { message: "Unknown action" } };
};

