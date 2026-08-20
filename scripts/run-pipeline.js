// scripts/run-pipeline.js
const axios = require("axios");
const { transformGLEntry } = require("./transform-gl");

const SAP_URL =
  "http://localhost:4001/sap/opu/odata/sap/API_JOURNALENTRYITEM_SRV/JournalEntryItems";
const FINSIGHT_URL = "http://localhost:4002/api/v1/journal-entries";

async function runPipeline() {
  console.log("Extracting from SAP...");
  const sapResponse = await axios.get(SAP_URL);
  const rawEntries = sapResponse.data.d.results;
  console.log(`Extracted ${rawEntries.length} records.`);

  console.log("Transforming...");
  const transformed = rawEntries.map(transformGLEntry);

  console.log("Loading to FinSight...");
  let success = 0,
    duplicates = 0,
    failed = 0;

  for (const entry of transformed) {
    try {
      await axios.post(FINSIGHT_URL, entry);
      success++;
    } catch (err) {
      if (err.response?.status === 409) duplicates++;
      else failed++;
      console.log(
        `  Load failed for ${entry.documentId}: ${err.response?.data?.errorCode || err.message}`,
      );
    }
  }

  console.log(
    `\nBatch complete: ${success} loaded, ${duplicates} duplicates, ${failed} failed.`,
  );
}

runPipeline().catch(console.error);