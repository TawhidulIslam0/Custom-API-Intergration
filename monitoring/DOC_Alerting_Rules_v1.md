# Alerting Rules & Severity Specification

## Overview
This document defines 15+ alerting rules categorized by severity level (P1 through P4), notification channels, and automated escalation actions.

## Alerting Rules (Rules ALT-001 to ALT-016)

### P1 - Critical (Immediate PagerDuty Page, SLA: 5 mins)
* **ALT-001**: `SAP_Source_Down` - SAP S/4HANA source endpoints unreachable for > 2 minutes.
* **ALT-002**: `Circuit_Breaker_Open` - Integration circuit breaker tripped to Open state.
* **ALT-003**: `Reconciliation_Mismatch` - Monthly/Daily financial variance detected (> 0 discrepancies).
* **ALT-004**: `Database_Pool_Exhaustion` - HikariCP connection pool utilization > 95%.

### P2 - High (PagerDuty / Slack Alert, SLA: 15 mins)
* **ALT-005**: `High_Error_Rate` - System error rate exceeds 5% over a 5-minute rolling window.
* **ALT-006**: `DLQ_Backlog_Threshold` - Dead Letter Queue unresolved message count exceeds 50 items.
* **ALT-007**: `OAuth_Token_Failure` - OAuth 2.0 token refresh success rate drops below 99%.
* **ALT-008**: `Pipeline_Latency_Spike` - End-to-end p95 pipeline latency exceeds 3000ms.

### P3 - Medium (Slack Warning Log, SLA: 2 hours)
* **ALT-009**: `Container_Resource_Spike` - Container CPU or memory utilization exceeds 80% sustained.
* **ALT-010**: `Data_Quality_Spike` - Spike in automated data quality rule failures (> 100/min).
* **ALT-011**: `Batch_Throughput_Drop` - Batch extraction throughput drops below 10 RPS during active windows.
* **ALT-012**: `Destination_Latency_Slow` - FinSight destination API p99 latency exceeds 1500ms.

### P4 - Low (Dashboard Counter / Daily Digest, SLA: 24 hours)
* **ALT-013**: `Transient_Retry_Exhaustion` - Individual transaction exhausted initial transient retries.
* **ALT-014**: `Schema_Warning_Log` - Non-breaking schema extension or deprecation warning logged.
* **ALT-015**: `Token_Cache_Expiry` - Cached OAuth token nearing expiration threshold.
* **ALT-016**: `Audit_Log_Rotation` - Audit log partition rotation event completed successfully.