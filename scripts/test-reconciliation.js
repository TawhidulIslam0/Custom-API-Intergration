// scripts/test-reconciliation.js
const { reconcileBatch } = require("./reconcile");
const { validateJournalEntry, validateGSTIN } = require("./data-quality");

console.log("--- Test 1: Reconciliation (clean batch) ---");
const sourceEntries = [
  { DRCRK: "S", HSL: "10000.00" },
  { DRCRK: "H", HSL: "10000.00" },
];
const targetEntries = [
  { type: "DEBIT", amountLC: 10000.0 },
  { type: "CREDIT", amountLC: 10000.0 },
];
console.log(reconcileBatch(sourceEntries, targetEntries));

console.log("\n--- Test 2: Reconciliation (BREAK - variance detected) ---");
const targetEntriesWithBreak = [
  { type: "DEBIT", amountLC: 10000.0 },
  { type: "CREDIT", amountLC: 9995.5 },
];
console.log(reconcileBatch(sourceEntries, targetEntriesWithBreak));

console.log("\n--- Test 3: Data quality validation (valid entry) ---");
console.log(
  validateJournalEntry({
    documentId: "MC01-2026-1234567890",
    postingDate: "2026-03-15",
    amountLC: 45230.5,
  }),
);

console.log("\n--- Test 4: Data quality validation (invalid entry) ---");
console.log(
  validateJournalEntry({
    documentId: "bad-id-format",
    postingDate: "15-03-2026",
    amountLC: null,
  }),
);

console.log("\n--- Test 5: GSTIN validation ---");
console.log("Valid GSTIN:", validateGSTIN("27AAPFU0939F1ZV"));
console.log("Invalid GSTIN:", validateGSTIN("INVALID123"));