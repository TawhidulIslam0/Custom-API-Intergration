# Post-Deployment Verification Checks

## Overview
This document specifies 10+ mandatory post-deployment verification checks to ensure system health, data integrity, data flow continuity, successful reconciliation, and alerting functionality following a production rollout.

## Verification Checks
1. **VC-01: Pod Health & Stability**
   * **Target**: Kubernetes Pods
   * **Verification**: Confirm 100% of pods in `finsight-prod` are in `Running` state with zero restart loops over a 15-minute observation window.

2. **VC-02: ODP Extraction Stream Connectivity**
   * **Target**: SAP S/4HANA ODP Source
   * **Verification**: Verify successful handshake and active polling delta stream between extractor service and SAP S/4HANA.

3. **VC-03: Kafka Broker & Consumer Lag**
   * **Target**: Apache Kafka Cluster
   * **Verification**: Inspect Kafka consumer group lag metrics using Prometheus/Grafana to ensure lag remains at zero or within acceptable baseline bounds.

4. **VC-04: Transform Engine Throughput**
   * **Target**: Transform Engine Microservice
   * **Verification**: Verify structured JSON logs confirm active message transformation without data parsing exceptions.

5. **VC-05: FinSight Destination API Sync**
   * **Target**: FinSight Destination Endpoints
   * **Verification**: Confirm successful HTTP 201/200 response codes on transactional payload syncs to destination endpoints (DST-001 through DST-012).

6. **VC-06: OAuth 2.0 Token Caching**
   * **Target**: Authentication Service
   * **Verification**: Validate token acquisition, caching, and automatic renewal cycles without authentication failures.

7. **VC-07: Automated Reconciliation Job**
   * **Target**: Reconciliation Engine
   * **Verification**: Trigger a dry-run reconciliation run and confirm 0% variance between source extract totals and destination record counts.

8. **VC-08: Dead Letter Queue (DLQ) Monitoring**
   * **Target**: DLQ Topic & Error Queue
   * **Verification**: Confirm zero critical items in the DLQ immediately following deployment startup.

9. **VC-09: Prometheus Metrics Collection**
   * **Target**: Prometheus Scraper
   * **Verification**: Verify all custom application metrics (`finsight_extraction_latency_ms`, `finsight_records_processed_total`) are actively scraping.

10. **VC-10: Grafana Dashboard Operational Status**
    * **Target**: Grafana Dashboards
    * **Verification**: Open production monitoring dashboards and verify real-time data visualization panels load without connection timeouts.

11. **VC-11: PagerDuty Alert Routing Test**
    * **Target**: Alertmanager / PagerDuty Sink
    * **Verification**: Fire a non-critical test alert through the pipeline and confirm receipt in the on-call pager channel.