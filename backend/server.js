const express = require("express");
const cors = require("cors");

const app = express();

// OK for dev/testing. Tighten later if you want.
app.use(cors());

// Parse JSON
app.use(express.json({ limit: "1mb" }));

// Parse form-encoded bodies (some clients send this)
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

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

  // If empty or undefined, return empty object
  if (!body) return {};

  // If Express parsed it as a string, try parsing JSON
  if (typeof body === "string") {
    const parsed = tryParseJsonString(body);
    return parsed ?? { raw: body };
  }

  // If it’s an object, it might still contain JSON as a single key
  if (typeof body === "object" && !Array.isArray(body)) {
    const keys = Object.keys(body);

    // Case: { '{"action":"get","objectId":"123"}': '' }
    if (keys.length === 1) {
      const onlyKey = keys[0];
      const parsedKey = tryParseJsonString(onlyKey);
      if (parsedKey) return parsedKey;

      // Case: { payload: '{"action":"get","objectId":"123"}' }
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

  // Arrays etc.
  return { raw: body };
}

app.post("/api/fee-sheet", async (req, res) => {
  try {
    const body = normalizeBody(req);

    // Helpful logs for Render
    console.log("---- /api/fee-sheet ----");
    console.log("content-type:", req.headers["content-type"]);
    console.log("normalized body:", body);

    const { action, objectId, createdBy } = body || {};

    if (!action || !objectId) {
      // DEBUG RESPONSE so you can see what HubSpot actually sent
      return res.status(400).json({
        message: "Need action + objectId",
        received: body,
      });
    }

    if (action === "get") {
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
      received: body,
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

