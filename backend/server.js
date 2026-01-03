const express = require("express");
const cors = require("cors");

const app = express();

// Keep CORS simple for now (OK for dev)
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: "1mb" }));

// ALSO parse form-style bodies (HubSpot / proxies sometimes send this way)
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("OK"));

function normalizeBody(req) {
  // Start with whatever Express parsed
  let body = req.body || {};

  // If body came in as a JSON string for some reason, parse it
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      // leave as string
    }
  }

  // Sometimes platforms send a single key containing JSON
  // e.g. { '{"action":"get","objectId":"123"}': '' }
  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    Object.keys(body).length === 1
  ) {
    const onlyKey = Object.keys(body)[0];
    if (onlyKey && onlyKey.trim().startsWith("{")) {
      try {
        return JSON.parse(onlyKey);
      } catch {
        // ignore
      }
    }
  }

  return body;
}

app.post("/api/fee-sheet", async (req, res) => {
  try {
    const body = normalizeBody(req);

    // Helpful logging (shows up in Render logs)
    console.log("Incoming /api/fee-sheet");
    console.log("headers content-type:", req.headers["content-type"]);
    console.log("raw body parsed:", body);

    const { action, objectId, createdBy } = body || {};

    if (!action || !objectId) {
      return res.status(400).json({
        message: "Need action + objectId",
        received: body || null,
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

