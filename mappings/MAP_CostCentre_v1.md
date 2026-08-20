# Cost Centre Accounting Domain Mappings (SRC-004 to DST-004)

| Mapping ID | Source Field (SAP) | Target Field (FinSight) | Transformation Rule | Validation/Constraint | Error Handling | Business Context |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| M-CC-001 | CSKS-KOSTL | cost_centre_id | Direct mapping | Max 10 chars | Route to DLQ | Cost centre technical identifier |
| M-CC-002 | CSKS-BUKRS | company_code | Direct mapping | Exactly 4 chars | Route to DLQ | Controlling area company code |
| M-CC-003 | CSKT-KTEXT | cost_centre_name | Direct mapping | Max 40 chars | Truncate | Cost centre description name |
| M-CC-004 | CSKS-KHINR | hierarchy_node | Direct mapping | Valid node lookup | Default to ROOT | Cost centre hierarchy flattening |
| M-CC-005 | CSKS-VERAK | person_responsible | Direct mapping | Max 20 chars | Default to UNKNOWN | Cost centre manager/owner |
| M-CC-006 | CSKS-DATAB | valid_from | ISO date conversion (YYYYMMDD to YYYY-MM-DD) | Valid ISO date | Route to DLQ | Validity start date |