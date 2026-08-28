# Risk Register — SAP to FinSight Integration

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| RSK-01 | SAP RFC pool exhaustion blocks dialog users | Medium | High | Cap integration to 40/50 connections, circuit breaker on pool >90% |
| RSK-02 | ODP provider structure changes after SAP support pack | Medium | High | Schema validation on extraction, alert + graceful degradation |
| RSK-03 | Network bandwidth saturation during business hours | Low | Medium | Throttle to 25% of 450Mbps link, schedule bulk loads off-peak |
| RSK-04 | Currency conversion rounding errors cause reconciliation breaks | Medium | Medium | Use TCURR point-in-time rates, tolerance threshold of INR 1.00 |
| RSK-05 | GST breakdown lost during transformation, causing tax filing issues | Low | High | Explicit CGST/SGST/IGST field mapping with validation rule |
| RSK-06 | Kafka broker failure causes message loss | Low | High | 3-broker cluster with replication factor 3, ISR monitoring |
| RSK-07 | Data residency violation (processing outside India) | Low | Critical | All infra pinned to AWS Mumbai region, contractually enforced |
| RSK-08 | Batch job overlaps with SAP nightly maintenance window | Medium | Medium | Scheduler hard-blocks 01:00-04:30 IST and 2nd/4th Saturday |
| RSK-09 | Master data (cost centre/profit centre) out of sync causes orphan records | Medium | Medium | Master data sync job runs before each transaction batch |
| RSK-10 | OAuth token expiry mid-batch interrupts loading | Medium | Low | Auto-refresh via refresh_token grant before expiry buffer |
| RSK-11 | DLQ grows unbounded without review, hiding systemic issues | Medium | Medium | DLQ depth alert threshold (>500), weekly manual review SLA |
| RSK-12 | Multi-company-code records route to wrong analytics tenant | Low | High | Explicit company-code-to-tenant mapping table, validated in tests |