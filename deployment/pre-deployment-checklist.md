# Pre-Deployment Checklist (16 Items)

## Overview
This checklist defines the mandatory prerequisites that must be completed and verified prior to initiating the production deployment of the SAP S/4HANA to Zetheta FinSight integration platform.

## Checklist Items
1. **[ ] Environment Provisioning**: Production Kubernetes cluster (EKS/AKS) successfully provisioned and verified.
2. **[ ] Namespace Isolation**: Dedicated namespaces (`finsight-prod`, `finsight-kafka`) configured and secured with RBAC.
3. **[ ] Secret Management**: Production database credentials, SAP service user secrets, and API keys securely stored in Vault or AWS Secrets Manager.
4. **[ ] SSL/TLS Certificates**: Wildcard certificates and custom domain SSL certificates validated and loaded into ingress controllers.
5. **[ ] Database Migrations**: Production PostgreSQL and Redis instances deployed with schema migration scripts pre-tested.
6. **[ ] Kafka Cluster Readiness**: Apache Kafka cluster deployed with replication factor set to 3 and min.insync.replicas set to 2.
7. **[ ] SAP S/4HANA Connectivity**: ODP extraction endpoints and RFC/HTTP connectivity tested and whitelisted in the corporate firewall.
8. **[ ] OAuth 2.0 Credentials**: FinSight destination API OAuth client credentials generated and tested for token generation.
9. **[ ] Backup Verification**: Full automated snapshots and point-in-time recovery (PITR) configured for all primary databases.
10. **[ ] Monitoring & Prometheus Setup**: Prometheus operators and Grafana dashboards deployed with active alert sinks.
11. **[ ] PagerDuty Integration**: On-call rotation schedules configured and notification endpoints verified with a test alert.
12. **[ ] CI/CD Pipeline Check**: Final container images tagged with semantic versioning and scanned for vulnerabilities (Zero Critical CVEs).
13. **[ ] CAB Approval**: Change Advisory Board (CAB) formal sign-off and ticket approval secured.
14. **[ ] Stakeholder Notification**: Maintenance window notification broadcasted to finance, accounting, and IT operations teams.
15. **[ ] Rollback Plan Verification**: Rollback script and previous stable image tags verified and ready for execution.
16. **[ ] Network Policy Auditing**: Calico/Kubernetes network policies applied to restrict inter-service traffic correctly.