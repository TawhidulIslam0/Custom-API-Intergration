# Profit Centre Accounting Domain Mappings (SRC-005 to DST-005)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-PC-001 | CEPC-PRCTR | profit_centre_id | Direct mapping | Max 10 chars | Route to DLQ | Profit centre technical identifier |
| M-PC-002 | CEPC-KOKRS | controlling_area | Direct mapping | Exactly 4 chars | Route to DLQ | Controlling area reference |
| M-PC-003 | CEPCT-LTEXT | profit_centre_name | Direct mapping | Max 40 chars | Truncate | Profit centre long description |
| M-PC-004 | CEPC-SEGMENT | segment_reporting | Direct mapping | Valid segment lookup | Default to GEN_SEG | Segment reporting alignment |