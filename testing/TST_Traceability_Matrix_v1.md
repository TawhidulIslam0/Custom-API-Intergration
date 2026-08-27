
---

# 5. `testing/TST_Traceability_Matrix_v1.md`

This one is particularly important. Replace the entire file:

```markdown
# Requirements Traceability Matrix

**Project:** FDE-9B Integration  
**Version:** 1.1  
**Status:** Final

---

## 1. Purpose

This matrix provides traceability between the integration requirements and
the complete testing inventory.

The testing framework contains **36 scenarios** across functional,
non-functional, failure, security, reconciliation, and operational
categories.

---

## 2. Traceability Matrix

| ID | Scenario | Category | Requirement / Coverage |
|---|---|---|---|
| F-01 | Happy Path Extraction | Functional | SAP → Middleware → FinSight |
| F-02 | AP Synchronization | Functional | SRC-002 / DST-002 |
| F-03 | AR Synchronization | Functional | SRC-003 / DST-003 |
| F-04 | Master Data Delta | Functional | SRC-004 / SRC-005 |
| F-05 | Multi-Company Code | Functional | Company-code isolation |
| F-06 | Fiscal Period Processing | Functional | Fiscal periods 01–16 |
| F-07 | Hierarchy Flattening | Functional | Cost Centre hierarchy |
| F-08 | Procure-to-Pay | Functional | SRC-007 / DST-007 |
| F-09 | Bank Statement Normalization | Functional | SRC-010 / DST-010 |
| F-10 | Budget vs Actual | Functional | SRC-011 / reconciliation |
| NF-01 | Peak Load Ingestion | Non-Functional | ≥500 records/minute |
| NF-02 | Concurrent Extraction | Non-Functional | Concurrent processing/scalability |
| NF-03 | API Latency | Non-Functional | Average <500ms |
| NF-04 | Volume Scalability | Non-Functional | >100,000 records/day |
| NF-05 | 24-Hour Endurance | Non-Functional | Long-duration stability |
| FI-01 | SAP Connection Failure | Failure | Retry + circuit breaker |
| FI-02 | API Throttling | Failure | HTTP 429 + Retry-After |
| FI-03 | Kafka Broker Failure | Failure | Broker resilience |
| FI-04 | Malformed Payload | Failure | Data quality + DLQ |
| FI-05 | Network Partition | Failure | Fault tolerance |
| FI-06 | Database Deadlock | Failure | Rollback + retry |
| SEC-01 | Token Expiry | Security | OAuth token lifecycle |
| SEC-02 | Unauthorized Access | Security | Authentication/authorization |
| SEC-03 | Encryption Verification | Security | TLS/secrets protection |
| SEC-04 | API Rate Limiting | Security | Abuse protection |
| REC-01 | Financial Variance | Reconciliation | Accuracy |
| REC-02 | Completeness Check | Reconciliation | Record counts |
| REC-03 | FX Discrepancy | Reconciliation | Currency tolerance |
| OPS-01 | Health Verification | Operational | Service health |
| OPS-02 | DLQ Monitoring | Operational | DLQ observability |
| OPS-03 | Alert Escalation | Operational | P1–P4 alerting |
| OPS-04 | Rollback Verification | Operational | Recovery |
| OPS-05 | Post-Deployment Validation | Operational | Production readiness |
| OPS-06 | Logging Verification | Operational | Structured telemetry |
| OPS-07 | Kafka Consumer Lag | Operational | Streaming monitoring |
| OPS-08 | Reconciliation Report Generation | Operational | Audit/reporting |

---

## 3. Requirements Coverage

### Performance

| Requirement | Test |
|---|---|
| ≥500 records/minute | NF-01 |
| Average API latency <500ms | NF-03 |
| >100,000 records/day | NF-04 |
| 24-hour endurance | NF-05 |

### Scalability

| Requirement | Test |
|---|---|
| Concurrent processing | NF-02 |
| Horizontal scaling behavior | NF-02 / NF-04 |
| Kafka consumer lag | NF-02 / OPS-07 |

### Security

| Requirement | Test |
|---|---|
| OAuth authentication | SEC-01 |
| Unauthorized access rejection | SEC-02 |
| Encryption | SEC-03 |
| Rate limiting | SEC-04 |

### Reliability

| Requirement | Test |
|---|---|
| Retry behavior | FI-01 / FI-02 / FI-06 |
| Circuit breaker | FI-01 / FI-05 |
| DLQ routing | FI-04 / OPS-02 |
| Kafka resilience | FI-03 |
| Network recovery | FI-05 |

### Reconciliation

| Requirement | Test |
|---|---|
| Accuracy | REC-01 |
| Completeness | REC-02 |
| Currency tolerance | REC-03 |
| Reconciliation reporting | OPS-08 |

### Deployment & Operations

| Requirement | Test |
|---|---|
| Service health | OPS-01 |
| DLQ monitoring | OPS-02 |
| Alert escalation | OPS-03 |
| Rollback | OPS-04 |
| Post-deployment validation | OPS-05 |
| Structured logging | OPS-06 |
| Kafka monitoring | OPS-07 |
| Reconciliation reporting | OPS-08 |

---

## 4. Test Inventory

| Category | Count |
|---|---:|
| Functional | 10 |
| Non-Functional | 5 |
| Failure Injection | 6 |
| Security | 4 |
| Reconciliation | 3 |
| Operational | 8 |
| **TOTAL** | **36** |

**Total Test Scenarios: 36**