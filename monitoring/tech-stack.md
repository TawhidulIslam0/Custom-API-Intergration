# Monitoring Technology Stack Specification

## Core Stack Components
1. **Metrics Collection**: Prometheus scraping endpoints via custom micrometer instrumentation across all Java/Node microservices.
2. **Visualization & Dashboards**: Grafana deployed on Kubernetes with role-based access control (RBAC) and integrated alerting channels.
3. **Log Aggregation & Indexing**: Elasticsearch, Logstash, and Kibana (ELK Stack) / OpenSearch for structured JSON log processing and distributed tracing lookup (`correlation_id`).
4. **Incident Response & PagerDuty**: PagerDuty integrated with Grafana and Prometheus Alertmanager for automated P1/P2 paging and escalation routing.