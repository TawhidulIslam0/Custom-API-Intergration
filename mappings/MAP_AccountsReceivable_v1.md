# Accounts Receivable Domain Mappings (SRC-003 to DST-003)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-AR-001 | KNA1-KUNNR | customer_id | Direct mapping | Max 10 chars | Route to DLQ | Customer master identifier |
| M-AR-002 | KNA1-NAME1 | customer_name | Direct mapping | Max 35 chars | Truncate | Customer legal name |
| M-AR-003 | BSID-BELNR | billing_document | Direct mapping | Max 10 chars | Route to DLQ | AR billing document number |
| M-AR-004 | BSID-WRBTR | open_amount | Direct mapping | Numeric, 2 decimals | Route to DLQ | Outstanding AR amount |
| M-AR-005 | KNKK-KLIMK | credit_limit | Direct mapping | Numeric, positive | Default to 0 | Customer credit limit |
| M-AR-006 | BSID-MSCHL | dunning_level | Direct mapping | Single digit (0-4) | Default to 0 | Current dunning level |
| M-AR-007 | BSID-ZFBDT | due_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Invoice due date |
| M-AR-008 | KNB1-ZTERM | payment_terms | Direct mapping | Valid term lookup | Default to NET30 | Customer payment terms |