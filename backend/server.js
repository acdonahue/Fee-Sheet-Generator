const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("OK"));

app.post("/api/fee-sheet", async (req, res) => {
  const { action, objectId, createdBy } = req.body || {};

  if (!action || !objectId) {
    return res.status(400).json({ message: "Need action + objectId" });
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on " + PORT));
