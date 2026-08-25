# Inventory Domain Mappings (SRC-012 to DST-012)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-INV-001 | MSEG-MATNR | material_id | Direct mapping | Max 18 chars | Route to DLQ | Material master identifier |
| M-INV-002 | MSEG-WERKS | plant_id | Direct mapping | Exactly 4 chars | Route to DLQ | Inventory plant/location |
| M-INV-003 | MSEG-LGORT | storage_location | Direct mapping | Max 4 chars | Default to UNKNOWN | Storage location identifier |
| M-INV-004 | MSEG-MENGE | quantity | Direct mapping | Numeric, non-negative | Route to DLQ | Inventory movement quantity |
| M-INV-005 | MSEG-MEINS | unit_of_measure | Direct mapping | Valid ISO/SAP UOM | Default to EA | Quantity measurement unit |
| M-INV-006 | MSEG-BWART | movement_type | Direct mapping | Valid SAP movement type | Route to DLQ | Inventory movement classification |
| M-INV-007 | MSEG-BUDAT_MKPF | movement_date | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Inventory posting/movement date |
| M-INV-008 | MBEW-SALK3 | inventory_value | Direct mapping | Numeric, 2 decimals | Default to 0 | Inventory valuation amount |
| M-INV-009 | MBEW-VPRSV | valuation_method | Value mapping lookup | Valid S/V valuation indicator | Default to STANDARD | Inventory valuation method |
| M-INV-010 | MARD-LABST | unrestricted_stock | Direct mapping | Numeric, non-negative | Default to 0 | Unrestricted available stock |