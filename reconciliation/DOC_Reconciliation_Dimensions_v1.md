# Reconciliation Dimensions and Tolerances

## 1. Completeness
* **Definition**: Ensures all records extracted from SAP S/4HANA source endpoints are successfully ingested into FinSight without omission.
* **Method**: Record count comparison and hash totals between source extraction logs and destination ingestion logs.
* **Tolerance**: Exactly 0% variance (Zero tolerance for missing financial records).

## 2. Accuracy
* **Definition**: Verifies that monetary amounts, numerical values, and attributes match precisely between source and target systems.
* **Method**: Sum-total aggregation checks across financial domains (e.g., total GL line item amounts).
* **Tolerance**: Exact match for local currency amounts; rounding tolerance of $\pm 0.01$ allowed for multi-currency conversion allocations.

## 3. Timeliness
* **Definition**: Measures the end-to-end latency of data transfer from extraction timestamp to destination commit.
* **Method**: Pipeline telemetry tracking ingestion timestamp against source event timestamp.
* **Tolerance**: Batch processing completed within a 2-hour SLA window; real-time event streaming within a 5-second SLA window.

## 4. Consistency
* **Definition**: Checks that cross-domain relational dependencies (e.g., Cost Centres linked to General Ledger postings) remain valid and intact.
* **Method**: Automated relational integrity queries and foreign key validation sweeps.
* **Tolerance**: 100% referential integrity compliance; orphaned foreign keys trigger automated exception alerts.