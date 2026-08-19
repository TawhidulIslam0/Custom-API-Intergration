# Sales Orders Domain Mappings (SRC-008 to DST-008)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-SO-001 | VBAK-VBELN | sales_order_id | Direct mapping | Max 10 chars | Route to DLQ | Sales order identifier |
| M-SO-002 | VBAP-POSNR | so_line_item | Direct mapping | Numeric string | Route to DLQ | Sales order item number |
| M-SO-003 | VBUK-GBSTK | revenue_recognition_stage | Value mapping lookup | Valid stage status | Default to OPEN | Revenue recognition stage alignment |