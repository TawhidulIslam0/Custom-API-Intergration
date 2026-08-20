// scripts/smoke-test.js
// Post-deployment smoke test: verifies the full pipeline works end-to-end
// Run this against a live environment after deployment (Step 5 & 9 of runbook)
const axios = require("axios");
const { transformGLEntry } = require("./transform-gl");
const { reconcileBatch } = require("./reconcile");

const SAP_URL =
  "http://localhost:4001/sap/opu/odata/sap/API_JOURNALENTRYITEM_SRV/JournalEntryItems";
const FINSIGHT_URL = "http://localhost:4002/api/v1/journal-entries";

async function checkServiceHealth(url, name) {
  try {
    await axios.get(url, { timeout: 3000 });
    console.log(`  [PASS] ${name} is reachable`);
    return true;
  } catch (err) {
    console.log(`  [FAIL] ${name} is unreachable: ${err.message}`);
    return false;
  }
}

async function runSmokeTest() {
  console.log("=== Post-Deployment Smoke Test ===\n");

  console.log("1. Service health checks");
  const sapHealthy = await checkServiceHealth(SAP_URL, "SAP mock server");

  console.log("\n2. End-to-end test record flow");
  if (!sapHealthy) {
    console.log("  [SKIP] Cannot proceed without SAP connectivity");
    return;
  }

  const sapResponse = await axios.get(SAP_URL);
  const rawEntries = sapResponse.data.d.results.slice(0, 1); // just 1 test record
  const transformed = rawEntries.map(transformGLEntry);

  let loadSuccess = false;
  try {
    await axios.post(FINSIGHT_URL, transformed[0]);
    loadSuccess = true;
    console.log("  [PASS] Test record loaded to FinSight successfully");
  } catch (err) {
    console.log(
      `  [FAIL] Load failed: ${err.response?.data?.errorCode || err.message}`,
    );
  }

  console.log("\n3. Reconciliation check");
  if (loadSuccess) {
    const recon = reconcileBatch(rawEntries, transformed);
    console.log(`  Reconciliation status: ${recon.status}`);
    console.log(recon.status === "RECONCILED" ? "  [PASS]" : "  [FAIL]");
  }

  console.log("\n=== Smoke test complete ===");
}

runSmokeTest().catch((err) => console.error("Smoke test error:", err.message));