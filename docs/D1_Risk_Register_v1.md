# Risk Register — SAP S/4HANA to FinSight Integration

| ID | Risk Description | Probability | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | SAP RFC connection pool exhaustion or lockup during heavy batch extractions. | Medium | High | Enforce strict pool availability checks (<50 connections) and implement a 60-second backoff-and-retry before extraction. |
| **RSK-02** | ODP delta token invalidation or structure change causing missed records or extraction failures. | Medium | High | Store delta tokens securely after every successful pull; implement schema validation alerts on extraction endpoints. |
| **RSK-03** | Transient network failures or SAP gateway timeouts during real-time ODP delta polling. | High | Medium | Implement automated exponential backoff (`min_cap`, `base * 2 ^ attempt`) up to max retries before routing to DLQ. |
| **RSK-04** | Target API rate limiting (HTTP 429) from FinSight during high-throughput bulk loads. | High | Medium | Honor `Retry-After` headers explicitly in the Transform Engine and throttle requests using configurable page chunking. |
| **RSK-05** | Permanent data transformation errors or mapping failures causing silent data loss. | Low | Critical | Route unrecoverable and permanent errors directly to the Dead Letter Queue (DLQ) with P2/P3 Ops team alerts. |
| **RSK-06** | Data quality or business validation failures (e.g., missing mandatory tax/cost dimensions). | Medium | High | Route invalid payloads to a Business Exception Queue and automatically notify functional teams (e.g., AP team) for manual fix. |
| **RSK-07** | Currency rounding or precision discrepancies causing financial reconciliation checksum breaks. | Medium | High | Establish a defined tolerance threshold (e.g., INR 1.00); log variance details to Audit Log for Data Steward investigation. |
| **RSK-08** | Batch scheduling conflicts during SAP nightly maintenance windows. | Medium | Medium | Hard-block scheduler execution strictly outside the 01:00–04:30 IST maintenance window. |
| **RSK-09** | Orphaned financial records due to out-of-sync master data entities (cost/profit centers). | Medium | Medium | Run master data validation checks prior to triggering transaction batch loads. |
| **RSK-10** | Unmonitored Dead Letter Queue (DLQ) growth hiding persistent downstream integration bugs. | Medium | Medium | Set up automated alert thresholds for DLQ depth (>500 items) and mandate weekly manual review SLAs. |