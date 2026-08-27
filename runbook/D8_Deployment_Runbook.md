# Deliverable 8: Deployment Runbook

## 1. Pre-Deployment Checklist (16 items)

- [ ] All 25 test scenarios (Deliverable 7) pass in staging
- [ ] OpenAPI specs pass Spectral linting with zero errors/warnings
- [ ] Database/Kafka topic migrations reviewed and backward-compatible
- [ ] Configuration values for production environment verified (no staging URLs/keys)
- [ ] SAP Basis team notified of deployment window (Priya Deshmukh)
- [ ] Deployment scheduled outside SAP batch window (avoid 01:00-04:30 IST) and outside 2nd/4th Saturday maintenance
- [ ] FinSight maintenance window checked (avoid first Sunday 02:00-06:00 IST)
- [ ] Backup of current production configuration taken
- [ ] Rollback procedure tested in staging within the last 30 days
- [ ] On-call engineer assigned and confirmed availability
- [ ] CAB (Change Advisory Board) approval obtained with documented risk assessment
- [ ] Stakeholders notified: CFO, IT VP, Platform Engineering (per D9 communication plan)
- [ ] Monitoring dashboards (D6) confirmed operational and receiving test traffic
- [ ] DLQ and alerting channels (Slack, PagerDuty) confirmed working
- [ ] Secrets/credentials rotated if this deployment changes auth scope
- [ ] Smoke test script prepared and dry-run in staging

## 2. Deployment Steps

| Step | Action | Est. Duration |
|------|--------|----------------|
| 1 | Announce deployment start in #integration-deploys Slack channel | 1 min |
| 2 | Pause scheduler (stop new extraction triggers) | 2 min |
| 3 | Drain in-flight Kafka messages (allow current batch to complete) | 5 min |
| 4 | Deploy new container images to blue-green inactive environment | 10 min |
| 5 | Run smoke tests against inactive environment | 5 min |
| 6 | Switch traffic from active to newly deployed environment (blue-green swap) | 2 min |
| 7 | Resume scheduler | 1 min |
| 8 | Monitor error rate and throughput dashboards for 15 min | 15 min |
| 9 | Run post-deployment verification checks (see below) | 10 min |
| 10 | Announce deployment complete | 1 min |

**Total estimated duration: ~52 minutes**

## 3. Post-Deployment Verification Checks (11 items)

- [ ] All 3 services (API Gateway, Transformation Engine, Reconciliation Service) report healthy
- [ ] Scheduler successfully triggers a test extraction
- [ ] SAP connection established (RFC pool shows active connections)
- [ ] FinSight OAuth token successfully acquired
- [ ] Test record flows end-to-end (extract → transform → load → reconcile)
- [ ] Reconciliation status shows RECONCILED for test batch
- [ ] Monitoring dashboards showing live data (MON-001 through MON-012)
- [ ] No unexpected entries in DLQ
- [ ] Error rate <1% in first 15 minutes post-deploy
- [ ] Kafka consumer lag not increasing
- [ ] Circuit breakers all in CLOSED state

## 4. Rollback Procedure

### Decision Matrix

| Trigger Condition | Action | Decision Authority | Max Decision Time |
|---|---|---|---|
| Error rate >10% in first 15 min | Immediate rollback | On-call engineer | 5 min |
| Reconciliation BREAK on first batch | Immediate rollback | On-call engineer | 10 min |
| SAP RFC pool exhaustion | Immediate rollback | On-call engineer | 5 min |
| Data quality anomaly (non-critical) | Monitor, escalate to lead if persists >30 min | Lead Engineer | 30 min |
| Cosmetic/minor dashboard issue | No rollback, hotfix forward | Lead Engineer | N/A |

### Rollback Steps

1. Announce rollback initiation in #integration-deploys
2. Pause scheduler
3. Switch blue-green traffic back to previous (known-good) environment
4. Verify previous environment resumes processing correctly
5. Resume scheduler
6. Confirm reconciliation on next batch
7. Post-mortem scheduled within 24 hours

**Maximum rollback time target: <15 minutes** (per Section A7 production deployment concepts)

## 5. Maintenance Windows & Escalation

| Window | Schedule |
|--------|----------|
| SAP maintenance | 2nd and 4th Saturday, 22:00-06:00 IST |
| FinSight maintenance | First Sunday of month, 02:00-06:00 IST |
| SAP nightly batch (no heavy extraction) | Daily 01:00-04:30 IST |

### Escalation Contacts

| Role | Contact | Escalation Trigger |
|------|---------|---------------------|
| On-call Engineer | (rotation, see PagerDuty schedule) | Any P1/P2 alert |
| SAP Basis Admin | Priya Deshmukh | RFC pool, SAP performance issues |
| Lead Engineer | (assigned per sprint) | Rollback decision, unresolved P1 >30 min |
| Data Steward | (assigned) | Reconciliation breaks |