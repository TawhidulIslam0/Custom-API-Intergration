# Failure Injection Test Scenarios (Scenarios FI-01 to FI-05)

## Overview
This document specifies the 5 failure injection test scenarios validating resilience, circuit breakers, retries, and DLQ routing.

## Scenarios
1. **FI-01: SAP Connection Failure**
   * **Objective**: Test system resilience when SAP S/4HANA drops connection mid-extraction.
   * **Input**: Forced network drop on ODP extraction socket.
   * **Expected Result**: Exponential backoff retry mechanism engages; circuit breaker trips to Open upon threshold breach.

2. **FI-02: API Throttling (HTTP 429)**
   * **Objective**: Verify handling of rate-limiting responses from destination endpoints.
   * **Input**: Simulated HTTP 429 Too Many Requests response from FinSight API.
   * **Expected Result**: Request pauses, honors `Retry-After` header, and successfully retries.

3. **FI-03: Kafka Broker Failure**
   * **Objective**: Test message broker resilience during intermediate node failure.
   * **Input**: Intentional termination of primary Kafka broker pod.
   * **Expected Result**: Leader election successfully reassigns partitions with zero message loss.

4. **FI-04: Malformed Data Payload**
   * **Objective**: Validate error handling when encountering schema-invalid payloads.
   * **Input**: JSON payload missing mandatory fields or violating data quality rules.
   * **Expected Result**: Payload is rejected by validation engine and routed directly to the Dead Letter Queue (DLQ).

5. **FI-05: Network Partition (Split-Brain)**
   * **Objective**: Test integration engine behavior during a simulated network partition.
   * **Input**: Network isolation between microservice cluster and downstream data stores.
   * **Expected Result**: Transactions safely queue or fail gracefully without corrupting transactional states.