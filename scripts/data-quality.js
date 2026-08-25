// scripts/data-quality.js
// Day 9 - Data Quality Rules
// Implements DQ-001 through DQ-025 from:
// reconciliation/DOC_Data_Quality_Rules_v1.md

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TAX_CODE_REGEX = /^[A-Z0-9]{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_REGEX = /^[A-Z0-9][A-Z0-9 -]{2,9}$/i;
const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;
const ISO_CURRENCY_REGEX = /^[A-Z]{3}$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const RULES = {
  "DQ-001": "company_code must not be null or empty",
  "DQ-002": "fiscal_year must be present for ledger transactions",
  "DQ-003": "document_number must be provided",
  "DQ-004": "posting_date must not be null",
  "DQ-005": "currency_key must be populated on monetary fields",

  "DQ-006": "posting_date and document_date must use ISO 8601 format",
  "DQ-007": "tax_code must match the required alphanumeric pattern",
  "DQ-008": "email_address must pass email validation",
  "DQ-009": "postal_code must satisfy postal code constraints",
  "DQ-010": "iban must comply with IBAN format/check-digit validation",

  "DQ-011": "fiscal_period must be between 1 and 16",
  "DQ-012": "exchange_rate must be greater than 0 and less than 1000",
  "DQ-013": "ageing_days must not be below -365",
  "DQ-014": "discount_percentage must be between 0 and 100",
  "DQ-015": "asset_useful_life must be an integer between 1 and 100",

  "DQ-016": "cost_centre_id must exist in the Cost Centre master",
  "DQ-017": "profit_centre_id must exist in the Profit Centre master",
  "DQ-018": "vendor_id must exist in the vendor master",
  "DQ-019": "customer_id must exist in the customer master",

  "DQ-020": "net_amount plus tax_amount must equal gross_amount",
  "DQ-021": "clearing_date must not precede document_date",
  "DQ-022": "debit and credit amounts must balance",

  "DQ-023": "high-risk payment blocks require dual authorization",
  "DQ-024": "capital expenditure must have a valid project work order",
  "DQ-025": "material ledger revaluations require an open inventory period",
};

function addError(errors, rule, message, field = null) {
  errors.push({
    rule,
    field,
    message,
  });
}

function isNullOrEmpty(value) {
  return value === undefined || value === null || value === "";
}

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_REGEX.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function validateIBAN(iban) {
  if (typeof iban !== "string") {
    return false;
  }

  const normalized = iban.replace(/\s/g, "").toUpperCase();

  if (!IBAN_REGEX.test(normalized)) {
    return false;
  }

  // ISO 13616 / MOD-97 IBAN check.
  const rearranged = normalized.slice(4) + normalized.slice(0, 4);

  let numeric = "";

  for (const char of rearranged) {
    if (/[A-Z]/.test(char)) {
      numeric += String(char.charCodeAt(0) - 55);
    } else {
      numeric += char;
    }
  }

  let remainder = 0;

  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

function validateJournalEntry(entry = {}, context = {}) {
  const errors = [];

  /*
   * ============================================================
   * DQ-001 to DQ-005
   * NULL CHECKS
   * ============================================================
   */

  // DQ-001
  if (isNullOrEmpty(entry.company_code)) {
    addError(
      errors,
      "DQ-001",
      "company_code must not be null or empty",
      "company_code"
    );
  }

  // DQ-002
  if (entry.isLedgerTransaction !== false &&
      isNullOrEmpty(entry.fiscal_year)) {
    addError(
      errors,
      "DQ-002",
      "fiscal_year is required for ledger transactions",
      "fiscal_year"
    );
  }

  // DQ-003
  if (isNullOrEmpty(entry.document_number)) {
    addError(
      errors,
      "DQ-003",
      "document_number must be provided",
      "document_number"
    );
  }

  // DQ-004
  if (isNullOrEmpty(entry.posting_date)) {
    addError(
      errors,
      "DQ-004",
      "posting_date must not be null",
      "posting_date"
    );
  }

  // DQ-005
  if (
    entry.amount !== undefined ||
    entry.amountLC !== undefined ||
    entry.net_amount !== undefined ||
    entry.gross_amount !== undefined ||
    entry.tax_amount !== undefined
  ) {
    if (isNullOrEmpty(entry.currency_key) && isNullOrEmpty(entry.currency)) {
      addError(
        errors,
        "DQ-005",
        "currency_key must be populated for monetary fields",
        "currency_key"
      );
    }
  }

  /*
   * ============================================================
   * DQ-006 to DQ-010
   * FORMAT VALIDATION
   * ============================================================
   */

  // DQ-006
  for (const field of ["posting_date", "document_date"]) {
    if (
      entry[field] !== undefined &&
      entry[field] !== null &&
      !isValidDate(entry[field])
    ) {
      addError(
        errors,
        "DQ-006",
        `${field} must use valid ISO 8601 format YYYY-MM-DD`,
        field
      );
    }
  }

  // DQ-007
  if (
    entry.tax_code !== undefined &&
    entry.tax_code !== null &&
    !TAX_CODE_REGEX.test(String(entry.tax_code))
  ) {
    addError(
      errors,
      "DQ-007",
      "tax_code must contain exactly two alphanumeric characters",
      "tax_code"
    );
  }

  // DQ-008
  if (
    entry.email_address !== undefined &&
    entry.email_address !== null &&
    !EMAIL_REGEX.test(String(entry.email_address))
  ) {
    addError(
      errors,
      "DQ-008",
      "email_address format is invalid",
      "email_address"
    );
  }

  // DQ-009
  if (
    entry.postal_code !== undefined &&
    entry.postal_code !== null &&
    !POSTAL_CODE_REGEX.test(String(entry.postal_code))
  ) {
    addError(
      errors,
      "DQ-009",
      "postal_code format is invalid",
      "postal_code"
    );
  }

  // DQ-010
  if (
    entry.iban !== undefined &&
    entry.iban !== null &&
    !validateIBAN(entry.iban)
  ) {
    addError(
      errors,
      "DQ-010",
      "iban failed ISO 13616 validation",
      "iban"
    );
  }

  /*
   * ============================================================
   * DQ-011 to DQ-015
   * RANGE CHECKS
   * ============================================================
   */

  // DQ-011
  if (entry.fiscal_period !== undefined && entry.fiscal_period !== null) {
    const period = Number(entry.fiscal_period);

    if (!Number.isInteger(period) || period < 1 || period > 16) {
      addError(
        errors,
        "DQ-011",
        "fiscal_period must be an integer between 1 and 16",
        "fiscal_period"
      );
    }
  }

  // DQ-012
  if (entry.exchange_rate !== undefined && entry.exchange_rate !== null) {
    if (
      !isNumber(entry.exchange_rate) ||
      entry.exchange_rate <= 0 ||
      entry.exchange_rate >= 1000
    ) {
      addError(
        errors,
        "DQ-012",
        "exchange_rate must be greater than 0 and less than 1000",
        "exchange_rate"
      );
    }
  }

  // DQ-013
  if (entry.ageing_days !== undefined && entry.ageing_days !== null) {
    if (!isNumber(entry.ageing_days) || entry.ageing_days < -365) {
      addError(
        errors,
        "DQ-013",
        "ageing_days must not be less than -365",
        "ageing_days"
      );
    }
  }

  // DQ-014
  if (
    entry.discount_percentage !== undefined &&
    entry.discount_percentage !== null
  ) {
    if (
      !isNumber(entry.discount_percentage) ||
      entry.discount_percentage < 0 ||
      entry.discount_percentage > 100
    ) {
      addError(
        errors,
        "DQ-014",
        "discount_percentage must be between 0 and 100",
        "discount_percentage"
      );
    }
  }

  // DQ-015
  if (
    entry.asset_useful_life !== undefined &&
    entry.asset_useful_life !== null
  ) {
    if (
      !Number.isInteger(entry.asset_useful_life) ||
      entry.asset_useful_life < 1 ||
      entry.asset_useful_life > 100
    ) {
      addError(
        errors,
        "DQ-015",
        "asset_useful_life must be an integer between 1 and 100",
        "asset_useful_life"
      );
    }
  }

  /*
   * ============================================================
   * DQ-016 to DQ-019
   * REFERENTIAL INTEGRITY
   * ============================================================
   */

  // DQ-016
  if (entry.cost_centre_id !== undefined) {
    const validCostCentres = context.costCentres || [];

    if (
      !validCostCentres.includes(entry.cost_centre_id)
    ) {
      addError(
        errors,
        "DQ-016",
        "cost_centre_id does not exist in the active Cost Centre master",
        "cost_centre_id"
      );
    }
  }

  // DQ-017
  if (entry.profit_centre_id !== undefined) {
    const validProfitCentres = context.profitCentres || [];

    if (
      !validProfitCentres.includes(entry.profit_centre_id)
    ) {
      addError(
        errors,
        "DQ-017",
        "profit_centre_id does not resolve to a valid Profit Centre",
        "profit_centre_id"
      );
    }
  }

  // DQ-018
  if (entry.vendor_id !== undefined) {
    const validVendors = context.vendors || [];

    if (!validVendors.includes(entry.vendor_id)) {
      addError(
        errors,
        "DQ-018",
        "vendor_id does not exist in the vendor master",
        "vendor_id"
      );
    }
  }

  // DQ-019
  if (entry.customer_id !== undefined) {
    const validCustomers = context.customers || [];

    if (!validCustomers.includes(entry.customer_id)) {
      addError(
        errors,
        "DQ-019",
        "customer_id does not exist in the customer master",
        "customer_id"
      );
    }
  }

  /*
   * ============================================================
   * DQ-020 to DQ-022
   * CROSS-FIELD VALIDATION
   * ============================================================
   */

  // DQ-020
  if (
    isNumber(entry.net_amount) &&
    isNumber(entry.tax_amount) &&
    isNumber(entry.gross_amount)
  ) {
    const calculatedGross =
      Math.abs(entry.net_amount + entry.tax_amount);

    const variance =
      Math.abs(calculatedGross - Math.abs(entry.gross_amount));

    if (variance > 0.01) {
      addError(
        errors,
        "DQ-020",
        "net_amount plus tax_amount must equal gross_amount within 0.01 tolerance",
        "gross_amount"
      );
    }
  }

  // DQ-021
  if (
    isValidDate(entry.clearing_date) &&
    isValidDate(entry.document_date)
  ) {
    if (entry.clearing_date < entry.document_date) {
      addError(
        errors,
        "DQ-021",
        "clearing_date must not precede document_date",
        "clearing_date"
      );
    }
  }

  // DQ-022
  if (
    Array.isArray(entry.line_items) &&
    entry.line_items.length > 0
  ) {
    let debitTotal = 0;
    let creditTotal = 0;

    for (const line of entry.line_items) {
      if (isNumber(line.debit_amount)) {
        debitTotal += line.debit_amount;
      }

      if (isNumber(line.credit_amount)) {
        creditTotal += line.credit_amount;
      }
    }

    const variance = Math.abs(debitTotal - creditTotal);

    if (variance > 0.01) {
      addError(
        errors,
        "DQ-022",
        "debit and credit line items must balance within 0.01 tolerance",
        "line_items"
      );
    }
  }

  /*
   * ============================================================
   * DQ-023 to DQ-025
   * BUSINESS RULES
   * ============================================================
   */

  // DQ-023
  if (
    entry.high_risk_payment_block === true &&
    entry.dual_authorization !== true
  ) {
    addError(
      errors,
      "DQ-023",
      "High-risk payment blocks require dual-authorization sign-off metadata",
      "dual_authorization"
    );
  }

  // DQ-024
  if (
    entry.capital_expenditure === true &&
    isNullOrEmpty(entry.project_work_order)
  ) {
    addError(
      errors,
      "DQ-024",
      "Capital expenditure fixed asset postings require a valid project work order",
      "project_work_order"
    );
  }

  // DQ-025
  if (
    entry.material_ledger_revaluation === true &&
    entry.inventory_period_open !== true
  ) {
    addError(
      errors,
      "DQ-025",
      "Material ledger actual cost revaluations require an open inventory period",
      "inventory_period_open"
    );
  }

  return {
    valid: errors.length === 0,
    errorCount: errors.length,
    errors,
  };
}

/*
 * Backwards-compatible helper.
 *
 * Existing project code can still call validateGSTIN().
 */
function validateGSTIN(gstin) {
  if (!gstin) {
    return {
      valid: true,
      errors: [],
    };
  }

  const valid =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      String(gstin).toUpperCase()
    );

  return {
    valid,
    errors: valid
      ? []
      : [
          {
            rule: "DQ-008",
            field: "gstin",
            message: "GSTIN format invalid",
          },
        ],
  };
}

/*
 * Returns the complete rule catalogue.
 */
function getDataQualityRules() {
  return { ...RULES };
}

/*
 * Useful for QA/audit scripts.
 * Confirms that all DQ-001 through DQ-025 rules exist.
 */
function getRuleCoverage() {
  const ruleIds = Object.keys(RULES);

  const expected = Array.from(
    { length: 25 },
    (_, index) => `DQ-${String(index + 1).padStart(3, "0")}`
  );

  const missing = expected.filter((id) => !ruleIds.includes(id));

  return {
    expectedRules: 25,
    implementedRules: ruleIds.length,
    missingRules: missing,
    complete: missing.length === 0,
  };
}

module.exports = {
  validateJournalEntry,
  validateGSTIN,
  validateIBAN,
  getDataQualityRules,
  getRuleCoverage,
};