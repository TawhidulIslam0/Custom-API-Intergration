const express = require("express");
const app = express();
app.use(express.json());
const PORT = 4002;

// In-memory store to demo idempotency (duplicate detection)
const loadedEntries = new Map();

app.post("/api/v1/journal-entries", (req, res) => {
  const entry = req.body;

  if (!entry.documentId || !entry.postingDate || entry.amountLC === undefined) {
    return res.status(400).json({
      errorCode: "INVALID_REQUEST",
      message: "Missing required fields",
    });
  }

  if (loadedEntries.has(entry.documentId)) {
    return res.status(409).json({
      errorCode: "DUPLICATE_ENTRY",
      message: "Record with same business key already exists",
    });
  }

  loadedEntries.set(entry.documentId, entry);
  res.status(201).json({ status: "created", documentId: entry.documentId });
});

app.get("/api/v1/journal-entries/:id", (req, res) => {
  const entry = loadedEntries.get(req.params.id);
  if (!entry) return res.status(404).json({ errorCode: "RESOURCE_NOT_FOUND" });
  res.json(entry);
});

app.listen(PORT, () => {
  console.log(`Mock FinSight server running at http://localhost:${PORT}`);
});