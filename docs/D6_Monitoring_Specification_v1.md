# Deliverable 6: Monitoring & Alerting Dashboard Specification

## 1. Monitoring Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Metrics | Prometheus | Time-series metrics collection |
| Dashboards | Grafana | Visualization of the 12 panels below |
| Logs | ELK Stack (Elasticsearch, Logstash, Kibana) | Structured log search/analysis |
| Alerting | PagerDuty + Slack | Notification routing by severity |
| Tracing | OpenTelemetry + Jaeger | End-to-end request tracing across services |

## 2. Dashboard Panels (12 panels)

See `diagrams/monitoring/dashboard-mockup.md` for the layout. Full specs
(query, refresh interval, alert threshold) are in Appendix F of the project
brief — implemented here as configured for this project's specific domains:

| Panel ID | Title | Refresh | Alert Threshold |
|----------|-------|---------|------------------|
| MON-001 | Pipeline Health Overview | 30s | RED: PagerDuty P1 |
| MON-002 | Throughput (records/sec) | 15s | Warning: <50% baseline |
| MON-003 | Latency Distribution (P95) | 15s | P95 >5s: Warning |
| MON-004 | Error Rate (%) | 15s | >5%: Critical P1 |
| MON-005 | DLQ Depth | 30s | >500: Critical P1 |
| MON-006 | Reconciliation Status | 5m | BREAK: P2 High |
| MON-007 | SAP System Health (RFC pool) | 30s | Pool >90%: Critical |
| MON-008 | FinSight API Health | 30s | Headroom <10%: P2 |
| MON-009 | Data Freshness | 60s | Exceeds SLA: P3 |
| MON-010 | Resource Utilisation | 15s | Any >90%: P2 High |
| MON-011 | Kafka Consumer Lag | 15s | >50K msgs: P2 High |
| MON-012 | Circuit Breaker Status | 5s | Any Open: P2 alert |

## 3. Structured Logging Standard

All logs emitted as JSON with these 12 mandatory fields:

```json
{
  "timestamp": "2026-03-15T09:30:45.123+05:30",
  "level": "INFO",
  "service": "transformation-engine",
  "correlationId": "MC01-2026-5000000001",
  "batchId": "BATCH-GL-20260315-0930",
  "domain": "general-ledger",
  "operation": "transform",
  "durationMs": 45,
  "status": "success",
  "errorCode": null,
  "recordCount": 1,
  "environment": "production"
}
```

Correlation ID (using the source documentId) allows tracing a single record
through extraction → transformation → load → reconciliation stages, directly
satisfying Dr. Kulkarni's audit trail requirement.

## 4. Alerting Rules (16 rules, exceeds 15 minimum)

| Alert ID | Condition | Severity | Channel |
|----------|-----------|----------|---------|
| ALT-001 | Pipeline health = RED | P1 | PagerDuty |
| ALT-002 | Error rate >5% over 5 min | P1 | PagerDuty |
| ALT-003 | DLQ depth >500 | P1 | PagerDuty |
| ALT-004 | SAP RFC pool >90% | P1 | PagerDuty |
| ALT-005 | Kafka broker down | P1 | PagerDuty |
| ALT-006 | Reconciliation BREAK | P2 | Slack + Email |
| ALT-007 | FinSight token headroom <10% | P2 | Slack |
| ALT-008 | Resource utilisation >90% | P2 | Slack |
| ALT-009 | Kafka consumer lag >50K | P2 | Slack |
| ALT-010 | Circuit breaker OPEN | P2 | Slack |
| ALT-011 | Data freshness exceeds SLA | P3 | Email |
| ALT-012 | Throughput <50% baseline | P3 | Email |
| ALT-013 | P95 latency >5s | Warning | Dashboard only |
| ALT-014 | SAP maintenance window approaching (1hr) | Info | Slack |
| ALT-015 | Nightly batch window conflict detected | P2 | Slack |
| ALT-016 | GST validation failure rate >1% | P2 | Email to Finance |