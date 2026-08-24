# Data Quality Rules Specification

## 1. Null Checks (Rules DQ-001 to DQ-005)
* **DQ-001**: `company_code` must not be null or empty across all payload types.
* **DQ-002**: `fiscal_year` must be present and non-null for all ledger transactions.
* **DQ-003**: `document_number` must be provided for every financial posting.
* **DQ-004**: `posting_date` must not be null on transaction headers and line items.
* **DQ-005**: `currency_key` must be explicitly populated on all monetary fields.

## 2. Format Validation (Rules DQ-006 to DQ-010)
* **DQ-006**: `posting_date` and `document_date` must adhere to ISO 8601 format (`YYYY-MM-DD`).
* **DQ-007**: `tax_code` must conform to the defined alphanumeric regex pattern `^[A-Z0-9]{2}$`.
* **DQ-008**: `email_address` fields on vendor and customer records must pass standard RFC email regex validation.
* **DQ-009**: `postal_code` must match the regional country-specific postal code regex constraints.
* **DQ-010**: `iban` fields for banking details must comply with ISO 13616 check-digit verification rules.

## 3. Range Checks (Rules DQ-011 to DQ-015)
* **DQ-011**: `fiscal_period` must fall strictly within the inclusive integer range `1` to `16`.
* **DQ-012**: `exchange_rate` multipliers must be greater than `0.0` and less than `1000.0`.
* **DQ-013**: `ageing_days` calculations for AP/AR must not result in negative values below `-365`.
* **DQ-014**: `discount_percentage` must be within the valid business percentage range `0.00` to `100.00`.
* **DQ-015**: `asset_useful_life` years must be an integer between `1` and `100`.

## 4. Referential Integrity (Rules DQ-016 to DQ-019)
* **DQ-016**: `cost_centre_id` posted in GL transactions must exist in the active Cost Centre master table.
* **DQ-017**: `profit_centre_id` must resolve to a valid Profit Centre entity record.
* **DQ-018**: `vendor_id` referenced in Accounts Payable must exist within the master vendor database.
* **DQ-019**: `customer_id` referenced in Accounts Receivable must match an active customer profile.

## 5. Cross-Field Validation (Rules DQ-020 to DQ-022)
* **DQ-020**: `net_amount` plus `tax_amount` must equal the absolute `gross_amount` within a $0.01$ rounding tolerance.
* **DQ-021**: `clearing_date` must not chronologically precede the corresponding `document_date`.
* **DQ-022**: `debit_amount` and `credit_amount` line items within a balanced document must net to zero total variance.

## 6. Business Rules (Rules DQ-023 to DQ-025)
* **DQ-023**: Transactions flagged with high-risk payment blocks require dual-authorization sign-off metadata.
* **DQ-024**: Capital expenditure fixed asset postings must be associated with valid internal project work orders.
* **DQ-025**: Material ledger actual cost revaluations must only occur within open inventory periods.