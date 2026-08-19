# Material Ledger Domain Mappings (SRC-006 to DST-006)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-ML-001 | MBEW-MATNR | material_id | Direct mapping | Max 18 chars | Route to DLQ | Material master identifier |
| M-ML-002 | MBEW-BWKEY | valuation_area | Direct mapping | Exactly 4 chars | Route to DLQ | Valuation area/plant code |
| M-ML-003 | CKMLHD-KALNR | cost_estimate_id | Direct mapping | Numeric string | Route to DLQ | Cost estimate number |
| M-ML-004 | CKMLPP-SALK3 | actual_cost_amount | Direct mapping | Numeric, 2 decimals | Route to DLQ | Cumulative inventory value |
| M-ML-005 | CKMLPP-PRSD1 | price_difference | Direct mapping | Numeric, 2 decimals | Default to 0 | Price difference allocation |