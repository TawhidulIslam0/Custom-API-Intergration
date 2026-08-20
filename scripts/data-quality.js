// scripts/data-quality.js
// Implements a representative subset of the 25 data quality rules (D5)

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const DOC_ID_REGEX = /^[A-Z0-9]{2,6}-\d{4}-\d{1,10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateJournalEntry(entry) {
  const errors = [];

  // DQ-NULL-001/002/003
  if (!entry.documentId)
    errors.push({ rule: "DQ-NULL-001", message: "documentId is required" });
  if (!entry.postingDate)
    errors.push({ rule: "DQ-NULL-002", message: "postingDate is required" });
  if (entry.amountLC === undefined || entry.amountLC === null) {
    errors.push({ rule: "DQ-NULL-003", message: "amountLC is required" });
  }

  // DQ-FMT-001/004
  if (entry.postingDate && !DATE_REGEX.test(entry.postingDate)) {
    errors.push({
      rule: "DQ-FMT-001",
      message: "postingDate must be YYYY-MM-DD",
    });
  }
  if (entry.documentId && !DOC_ID_REGEX.test(entry.documentId)) {
    errors.push({ rule: "DQ-FMT-004", message: "documentId format invalid" });
  }

  // DQ-RNG-001
  if (entry.amountLC !== undefined && Math.abs(entry.amountLC) > 999999999.99) {
    errors.push({ rule: "DQ-RNG-001", message: "amountLC out of range" });
  }

  return { valid: errors.length === 0, errors };
}

function validateGSTIN(gstin) {
  if (!gstin) return { valid: true, errors: [] }; // nullable field
  const valid = GSTIN_REGEX.test(gstin);
  return {
    valid,
    errors: valid
      ? []
      : [{ rule: "DQ-FMT-003", message: "GSTIN format invalid" }],
  };
}

module.exports = { validateJournalEntry, validateGSTIN };