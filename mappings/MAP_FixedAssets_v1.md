# Fixed Assets Domain Mappings (SRC-009 to DST-009)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-FA-001 | ANLA-ANLN1 | asset_number | Direct mapping | Max 12 chars | Route to DLQ | Main fixed asset number |
| M-FA-002 | ANLA-ANLN2 | asset_sub_number | Direct mapping | Max 4 chars | Route to DLQ | Asset sub-number identifier |
| M-FA-003 | ANLB-AFABE | depreciation_method | Direct mapping | Valid depreciation key | Default to SLM | Depreciation method mapping |