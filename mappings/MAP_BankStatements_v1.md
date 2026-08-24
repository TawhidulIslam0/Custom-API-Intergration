# Bank Statements Domain Mappings (SRC-010 to DST-010)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-BS-001 | FEBKO-KUKEY | statement_id | Direct mapping | Max 8 chars | Route to DLQ | Short key for bank statement |
| M-BS-002 | FEBKO-DAT00 | statement_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Bank statement creation date |
| M-BS-003 | FEBEP-VALUT | value_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Statement line item value date |