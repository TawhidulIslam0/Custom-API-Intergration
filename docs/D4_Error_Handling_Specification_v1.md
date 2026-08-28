# Deliverable 4: Error Handling & Retry Framework

## 1. Error Classification Taxonomy

| Category | Description | Retry? | Example |
|----------|-------------|--------|---------|
| TRANSIENT | Temporary failure, likely to succeed on retry | Yes, with backoff | Network timeout, HTTP 429, HTTP 503 |
| PERMANENT | Will never succeed without intervention | No | Invalid schema, expired/revoked token |
| DATA QUALITY | Source data itself is malformed or incomplete | No (routed to DLQ/exception queue) | NULL required field, invalid GSTIN |
| SYSTEM | Infrastructure-level failure | No (circuit breaker trips) | Kafka broker unreachable, disk full |

Full error code registry: see Appendix J of the project brief
(`ERR-EXT-*`, `ERR-MAP-*`, `ERR-LOAD-*`, `ERR-RECON-*`, `ERR-SYS-*`).

## 2. Retry Strategy — Exponential Backoff with Jitter

Formula: `wait = min(cap, random(base, base * 2^attempt))`

| Parameter | Value |
|-----------|-------|
| base | 2 seconds |
| cap | 60 seconds |
| max attempts | 3 (TRANSIENT), 5 (SERVICE_UNAVAILABLE per Appendix B) |
| jitter | Full jitter (random between 0 and calculated backoff) |

Jitter prevents multiple failed requests from retrying in lockstep
("thundering herd"), which would otherwise re-overload a recovering service.

## 3. Circuit Breaker State Machine

Three states, applied per downstream dependency (SAP RFC, FinSight API):

| State | Behaviour | Transition |
|-------|-----------|------------|
| CLOSED | Requests flow normally | → OPEN after 5 consecutive failures |
| OPEN | All requests fail fast, no calls made | → HALF_OPEN after 30s cooldown |
| HALF_OPEN | Allows 1 probe request | → CLOSED if success; → OPEN if failure |

Parameters:
- Failure threshold: 5 consecutive failures
- Open duration: 30 seconds
- Half-open probe: 1 request
- Success threshold to close: 1 success

## 4. Dead Letter Queue (DLQ) Design

- Implementation: dedicated Kafka topic per domain (`dlq-gl-entries`, `dlq-ap-items`, etc.)
- Retention: 30 days (extended vs. 7-day default on main topics)
- Each DLQ message includes: original payload, error code, error message,
  timestamp, retry count, and correlation ID for tracing back to source batch
- Manual reprocessing: an ops tool consumes from DLQ, allows inspect/fix/replay
- Alert threshold: DLQ depth > 500 messages triggers P2 alert (per MON-005)

## 5. Error Notification Matrix

| Error Class | Notification Channel | SLA |
|-------------|----------------------|-----|
| TRANSIENT (after max retries) | Slack #integration-alerts | 15 min |
| PERMANENT | PagerDuty P2 + Slack | 30 min |
| DATA QUALITY | Email to functional team (e.g. AP team) | 4 hours |
| SYSTEM | PagerDuty P1 | 5 min |