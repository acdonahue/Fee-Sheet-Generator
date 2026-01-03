const express = require("express");
const cors = require("cors");

const app = express();

// Simple CORS for now (fine for dev)
app.use(cors());

// Parse JSON bodies (for normal clients)
app.use(express.json({ limit: "1mb" }));

// Parse form bodies (for some clients/proxies)
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

app.get("/__version", (req, res) =>
  res.json({
    version: "REAL_BACKEND_2026-01-02",
    now: new Date().toISOString(),
  })
);

function tryParseJsonString(maybeJson) {
  if (typeof maybeJson !== "string") return null;
  const s = maybeJson.trim();
  if (!s.startsWith("{") && !s.startsWith("[")) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeBody(req) {
  let body = req.body;

  if (!body) return {};

  // If body is a string, try JSON parse
  if (typeof body === "string") {
    const parsed = tryParseJsonString(body);
    return parsed ?? { raw: body };
  }

  // If it’s an object, it might contain JSON as a single key/value
  if (typeof body === "object" && !Array.isArray(body)) {
    const keys = Object.keys(body);

    // Case: { '{"action":"get","objectId":"123"}': '' }
    if (keys.length === 1) {
      const onlyKey = keys[0];
      const parsedKey = tryParseJsonString(onlyKey);
      if (parsedKey) return parsedKey;

      const val = body[onlyKey];
      const parsedVal = tryParseJsonString(val);
      if (parsedVal) return parsedVal;
    }

    // Common wrapper keys
    for (const k of ["body", "payload", "data", "json"]) {
      if (body[k]) {
        const parsed = tryParseJsonString(body[k]);
        if (parsed) return parsed;
        if (typeof body[k] === "object") return body[k];
      }
    }

    return body;
  }

  return { raw: body };
}

// Support GET/POST (HubSpot fetch sometimes struggles with POST body)
app.all("/api/fee-sheet", async (req, res) => {
  try {
    const body = normalizeBody(req);

    // Prefer query params (most reliable through HubSpot fetch)
    const action = String(req.query.action || body.action || "");
    const objectId = String(req.query.objectId || body.objectId || "");
    const createdBy = String(req.query.createdBy || body.createdBy || "");

    // Helpful logs for Render debugging
    console.log("---- /api/fee-sheet ----");
    console.log("method:", req.method);
    console.log("content-type:", req.headers["content-type"]);
    console.log("query:", req.query);
    console.log("normalized body:", body);

    if (!action || !objectId) {
      return res.status(400).json({
        message: "Need action + objectId",
        received: {
          query: req.query || {},
          body: body || {},
        },
      });
    }

    if (action === "get") {
      // Placeholder "read" response
      return res.json({
        feeSheetUrl: "",
        feeSheetCreatedBy: "",
        feeSheetFileName: "",
        lastUpdatedAt: "",
        spCreatedAt: "",
        spLastModifiedAt: "",
        message: "Loaded (placeholder backend)",
      });
    }

    if (action === "create") {
      // Placeholder "create" response
      return res.json({
        feeSheetUrl: "https://example.com/fee-sheet-placeholder",
        feeSheetCreatedBy: createdBy || "Unknown user",
        feeSheetFileName: `Fee Sheet - Deal ${objectId}.xlsx`,
        lastUpdatedAt: new Date().toISOString(),
        spCreatedAt: new Date().toISOString(),
        spLastModifiedAt: new Date().toISOString(),
        message: "Created (placeholder backend)",
      });
    }

    return res.status(400).json({
      message: `Unknown action: ${action}`,
      received: {
        query: req.query || {},
        body: body || {},
      },
    });
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

