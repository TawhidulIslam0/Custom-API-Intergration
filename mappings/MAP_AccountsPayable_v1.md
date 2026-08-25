# Accounts Payable Domain Mappings (SRC-002 to DST-002)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-AP-001 | LFA1-LIFNR | vendor_id | Direct mapping | Max 10 chars | Route to DLQ | Vendor master identifier |
| M-AP-002 | LFA1-NAME1 | vendor_name | Direct mapping | Max 35 chars | Truncate | Vendor legal name |
| M-AP-003 | BSIK-BELNR | invoice_number | Direct mapping | Max 10 chars | Route to DLQ | AP invoice number |
| M-AP-004 | BSIK-WRBTR | invoice_amount | Direct mapping | Numeric, 2 decimals | Route to DLQ | Gross invoice amount |
| M-AP-005 | BSIK-ZFBDT | baseline_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Payment baseline date |
| M-AP-006 | BSIK-ZTERM | payment_terms | Direct mapping | Valid term lookup | Default to NET30 | Payment terms code |
| M-AP-007 | Calculated | ageing_bucket | Date diff calculation against baseline date | Ageing category (0-30, 31-60, etc.) | Default to Current | Calculated AP ageing |
| M-AP-008 | BSEG-ZLSCH | payment_method | Direct mapping | Single char code | Default to EFT | Payment method indicator |
| M-AP-009 | BSEG-XBLNR | reference_document_no | Direct mapping | Max 16 chars | Truncate | External vendor reference invoice number |
| M-AP-010 | BKPF-USNAM | created_by_user | Direct mapping | Max 12 chars | Default to SYSTEM | SAP user ID who posted the document |
| M-AP-011 | BSEG-PRCTR | profit_center | Direct mapping | Max 10 chars | Route to DLQ | Profit center assignment for AP line item |