// scripts/test-reconciliation.js
//
// Reconciliation, data-quality, and GSTIN validation tests.

const { reconcileBatch } = require("./reconcile");
const {
  validateJournalEntry,
  validateGSTIN,
} = require("./data-quality");

// ------------------------------------------------------------
// Test 1: Clean reconciliation
// ------------------------------------------------------------

console.log("--- Test 1: Reconciliation (clean batch) ---");

const sourceEntries = [
  {
    DRCRK: "S",
    HSL: "10000.00",
  },
  {
    DRCRK: "H",
    HSL: "10000.00",
  },
];

const targetEntries = [
  {
    type: "DEBIT",
    amountLC: 10000.0,
  },
  {
    type: "CREDIT",
    amountLC: 10000.0,
  },
];

console.log(
  reconcileBatch(
    sourceEntries,
    targetEntries,
  ),
);

// ------------------------------------------------------------
// Test 2: Reconciliation break / variance
// ------------------------------------------------------------

console.log(
  "\n--- Test 2: Reconciliation (BREAK - variance detected) ---",
);

const targetEntriesWithBreak = [
  {
    type: "DEBIT",
    amountLC: 10000.0,
  },
  {
    type: "CREDIT",
    amountLC: 9995.5,
  },
];

console.log(
  reconcileBatch(
    sourceEntries,
    targetEntriesWithBreak,
  ),
);

// ------------------------------------------------------------
// Test 3: Valid journal entry
// ------------------------------------------------------------

console.log(
  "\n--- Test 3: Data quality validation (valid entry) ---",
);

console.log(
  validateJournalEntry({
    // Required DQ fields
    company_code: "MC01",
    fiscal_year: 2026,
    document_number: "MC01-2026-1234567890",
    posting_date: "2026-03-15",
    currency_key: "USD",

    // Existing integration fields
    documentId: "MC01-2026-1234567890",
    postingDate: "2026-03-15",
    amountLC: 45230.5,
  }),
);

// ------------------------------------------------------------
// Test 4: Invalid journal entry
// ------------------------------------------------------------

console.log(
  "\n--- Test 4: Data quality validation (invalid entry) ---",
);

console.log(
  validateJournalEntry({
    // Intentionally invalid/missing required fields
    company_code: "",
    fiscal_year: null,
    document_number: "",
    posting_date: null,
    currency_key: "",

    // Existing integration fields
    documentId: "bad-id-format",
    postingDate: "15-03-2026",
    amountLC: null,
  }),
);

// ------------------------------------------------------------
// Test 5: GSTIN validation
// ------------------------------------------------------------

console.log("\n--- Test 5: GSTIN validation ---");

console.log(
  "Valid GSTIN:",
  validateGSTIN("27AAPFU0939F1ZV"),
);

console.log(
  "Invalid GSTIN:",
  validateGSTIN("INVALID123"),
);