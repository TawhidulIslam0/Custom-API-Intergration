# 12-Panel Monitoring Dashboard Specification

## Overview
This document specifies the 12 operational panels configured within Grafana for end-to-end monitoring of the SAP S/4HANA to Zetheta FinSight integration engine.

## Dashboard Panels (Panels 1–12)
1. **Panel 1: Ingestion Throughput (RPS)**
   * **Data Source**: Prometheus
   * **Metric**: `sum(rate(finsight_ingestion_requests_total[5m]))`
   * **Refresh Interval**: 10 seconds
   * **Alert Threshold**: < 10 RPS during active batch windows.

2. **Panel 2: End-to-End Pipeline Latency**
   * **Data Source**: Prometheus
   * **Metric**: `histogram_quantile(0.95, sum(rate(finsight_pipeline_duration_seconds_bucket[5m])) by (le))`
   * **Refresh Interval**: 30 seconds
   * **Alert Threshold**: > 3000ms p95 latency.

3. **Panel 3: Error Rate by Classification**
   * **Data Source**: Prometheus / ELK
   * **Metric**: `sum(rate(finsight_errors_total[5m])) by (error_class)`
   * **Refresh Interval**: 15 seconds
   * **Alert Threshold**: > 5% error rate across any class.

4. **Panel 4: Circuit Breaker Status Grid**
   * **Data Source**: Prometheus
   * **Metric**: `finsight_circuit_breaker_state`
   * **Refresh Interval**: 10 seconds
   * **Alert Threshold**: State == 1 (Open).

5. **Panel 5: Dead Letter Queue (DLQ) Backlog**
   * **Data Source**: CloudWatch / Kafka Exporter
   * **Metric**: `finsight_dlq_unresolved_messages_count`
   * **Refresh Interval**: 60 seconds
   * **Alert Threshold**: > 50 messages.

6. **Panel 6: SAP S/4HANA Source Endpoint Availability**
   * **Data Source**: Prometheus (Blackbox Exporter)
   * **Metric**: `probe_success{job="sap-s4-endpoints"}`
   * **Refresh Interval**: 30 seconds
   * **Alert Threshold**: 0 (Down for > 2 mins).

7. **Panel 7: FinSight Destination API Latency**
   * **Data Source**: Prometheus
   * **Metric**: `http_client_request_duration_seconds{client="finsight-api"}`
   * **Refresh Interval**: 15 seconds
   * **Alert Threshold**: p99 > 1500ms.

8. **Panel 8: Database Connection Pool Utilization**
   * **Data Source**: Prometheus (HikariCP)
   * **Metric**: `hikaricp_connections_active / hikaricp_connections_total`
   * **Refresh Interval**: 15 seconds
   * **Alert Threshold**: > 85% utilization.

9. **Panel 9: OAuth 2.0 Token Refresh Success Rate**
   * **Data Source**: Prometheus
   * **Metric**: `sum(rate(finsight_oauth_token_refreshes_total{status="success"}[5m]))`
   * **Refresh Interval**: 60 seconds
   * **Alert Threshold**: < 99% success rate.

10. **Panel 10: Data Quality Rule Failure Counter**
    * **Data Source**: ELK / Prometheus
    * **Metric**: `sum(rate(finsight_dq_rule_failures_total[10m])) by (rule_id)`
    * **Refresh Interval**: 60 seconds
    * **Alert Threshold**: Spike > 100 failures / min.

11. **Panel 11: Memory & CPU Utilization per Container**
    * **Data Source**: Prometheus (cAdvisor)
    * **Metric**: `container_cpu_usage_seconds_total` / `container_memory_working_set_bytes`
    * **Refresh Interval**: 30 seconds
    * **Alert Threshold**: > 80% sustained.

12. **Panel 12: Reconciliation Variance Monitor**
    * **Data Source**: PostgreSQL (Reconciliation DB)
    * **Metric**: `SELECT count(*) FROM reconciliation_logs WHERE status = 'MISMATCH'`
    * **Refresh Interval**: 5 minutes
    * **Alert Threshold**: > 0 financial discrepancies.