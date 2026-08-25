# Budget vs Actual Domain Mappings (SRC-011 to DST-011)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-BA-001 | COEP-KOSTL | cost_centre_id | Direct mapping | Max 10 chars | Route to DLQ | Cost centre responsible for budget/actual amount |
| M-BA-002 | CEPC-PRCTR | profit_centre_id | Direct mapping | Max 10 chars | Route to DLQ | Profit centre reporting dimension |
| M-BA-003 | COBK-GJAHR | fiscal_year | Direct mapping | 4 digits (YYYY) | Route to DLQ | Fiscal year classification |
| M-BA-004 | COEP-PERIO | fiscal_period | Direct mapping | 2 digits (01-16) | Route to DLQ | Financial reporting period |
| M-BA-005 | COEP-WKGBTR | actual_amount | Direct mapping | Numeric, 2 decimals | Route to DLQ | Actual posted amount |
| M-BA-006 | BPJA-WLJHR | budget_amount | Direct mapping | Numeric, 2 decimals | Default to 0 | Approved budget amount |
| M-BA-007 | COEP-WAERS | currency | Direct mapping | ISO 4217 (3 chars) | Default to USD | Transaction/reporting currency |
| M-BA-008 | Calculated | variance_amount | actual_amount - budget_amount | Numeric, 2 decimals | Recalculate from source values | Absolute budget versus actual variance |
| M-BA-009 | Calculated | variance_percentage | ((actual_amount - budget_amount) / budget_amount) * 100 | Numeric percentage; handle zero budget | Default to 0 when budget is zero | Relative budget variance |
| M-BA-010 | CSKT-KTEXT | cost_centre_name | Direct mapping | Max 40 chars | Truncate | Cost centre reporting description |