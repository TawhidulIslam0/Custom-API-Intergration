// scripts/reconcile.js
// Implements batch reconciliation per Deliverable 5

function reconcileBatch(sourceEntries, targetEntries, toleranceINR = 1.0) {
  const sourceDebits = sourceEntries
    .filter((e) => e.DRCRK === "S")
    .reduce((sum, e) => sum + parseFloat(e.HSL), 0);
  const sourceCredits = sourceEntries
    .filter((e) => e.DRCRK === "H")
    .reduce((sum, e) => sum + parseFloat(e.HSL), 0);

  const targetDebits = targetEntries
    .filter((e) => e.type === "DEBIT")
    .reduce((sum, e) => sum + e.amountLC, 0);
  const targetCredits = targetEntries
    .filter((e) => e.type === "CREDIT")
    .reduce((sum, e) => sum + e.amountLC, 0);

  const debitVariance = Math.abs(sourceDebits - targetDebits);
  const creditVariance = Math.abs(sourceCredits - targetCredits);
  const recordCountVariance = sourceEntries.length - targetEntries.length;

  const status =
    debitVariance <= toleranceINR &&
    creditVariance <= toleranceINR &&
    recordCountVariance === 0
      ? "RECONCILED"
      : "BREAK";

  return {
    batchId: `BATCH-GL-${Date.now()}`,
    status,
    sourceDebits: sourceDebits.toFixed(2),
    sourceCredits: sourceCredits.toFixed(2),
    targetDebits: targetDebits.toFixed(2),
    targetCredits: targetCredits.toFixed(2),
    debitVariance: debitVariance.toFixed(2),
    creditVariance: creditVariance.toFixed(2),
    recordCountVariance,
    recordsExtracted: sourceEntries.length,
    recordsLoaded: targetEntries.length,
  };
}

module.exports = { reconcileBatch };