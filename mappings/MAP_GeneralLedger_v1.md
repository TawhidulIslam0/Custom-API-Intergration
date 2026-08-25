# General Ledger Domain Mappings (SRC-001 to DST-001)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-GL-001 | BSEG-BUKRS | company_code | Direct mapping | Exactly 4 chars | Route to DLQ | Company code identification |
| M-GL-002 | BKPF-BELNR | document_number | Direct mapping | Max 10 chars | Route to DLQ | Accounting document number |
| M-GL-003 | BKPF-GJAHR | fiscal_year | Direct mapping | 4 digits (YYYY) | Route to DLQ | Fiscal year classification |
| M-GL-004 | BSEG-BUZEI | line_item_id | Direct mapping | Numeric string | Route to DLQ | Line item sequence number |
| M-GL-005 | BSEG-HKONT | gl_account | Direct mapping | Valid COA lookup | Skip and log | General ledger account |
| M-GL-006 | BSEG-WRBTR | amount | Direct mapping | Numeric, 2 decimals | Route to DLQ | Transaction currency amount |
| M-GL-007 | BKPF-WAERS | currency | Direct mapping | ISO 4217 (3 chars) | Default to USD | Transaction currency code |
| M-GL-008 | BKPF-BLDAT | document_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Document date |
| M-GL-009 | BKPF-BUDAT | posting_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Financial posting date |
| M-GL-010 | BKPF-MONAT | fiscal_period | Direct mapping | 2 digits (01-16) | Route to DLQ | Fiscal period allocation |
| M-GL-011 | BKPF-BKTXT | document_header_text | Direct mapping | Max 25 chars | Truncate | Header narrative |
| M-GL-012 | BSEG-SGTXT | line_item_text | Direct mapping | Max 50 chars | Truncate | Line item text description |
| M-GL-013 | BSEG-KOSTL | cost_center | Direct mapping | Max 10 chars | Route to DLQ | Cost center associated with GL posting |
| M-GL-014 | BKPF-STGRD | reversal_reason_code | Direct mapping | Valid SAP reason code lookup | Default to NONE | Reversal indicator/reason classification |