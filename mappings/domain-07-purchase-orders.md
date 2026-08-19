# Purchase Orders Domain Mappings (SRC-007 to DST-007)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-PO-001 | EKKO-EBELN | purchase_order_id | Direct mapping | Max 10 chars | Route to DLQ | Purchase order number |
| M-PO-002 | EKPO-EBELP | po_line_item | Direct mapping | Numeric string | Route to DLQ | Purchase order item number |
| M-PO-003 | EKBE-BELNR | gr_ir_document | Direct mapping | Max 10 chars | Route to DLQ | Goods receipt/invoice receipt ref |
| M-PO-004 | KONV-KBETR | pricing_condition | Direct mapping | Numeric, 2 decimals | Default to 0 | Pricing condition extraction rate |