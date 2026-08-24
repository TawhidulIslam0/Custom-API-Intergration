# Structured Logging Specification

## 1. Overview & Format
All microservices and integration components within the SAP-to-FinSight pipeline must emit logs in structured JSON format. Unstructured plain text logs are strictly prohibited in production environments to ensure seamless ingestion into ELK/Opensearch.

## 2. Mandatory 12 Fields
Every log entry must contain the following 12 mandatory fields:
1. `timestamp`: ISO 8601 UTC timestamp with millisecond precision (`YYYY-MM-DDTHH:mm:ss.SSSZ`).
2. `log_level`: Severity level (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`).
3. `service_id`: Unique identifier of the microservice emitting the log (e.g., `finsight-transform-engine`).
4. `environment`: Deployment stage (`dev`, `staging`, `prod`).
5. `correlation_id`: Unique distributed tracing identifier propagated across all service boundaries.
6. `transaction_id`: SAP or FinSight business transaction/document number.
7. `event_type`: Categorical identifier for the action being performed (e.g., `INGEST_STARTED`, `TRANSFORM_FAILED`, `DLQ_ROUTED`).
8. `source_endpoint`: Origin API or ODP endpoint identifier (e.g., `SRC-001`).
9. `destination_endpoint`: Target API endpoint identifier (e.g., `DST-001`).
10. `duration_ms`: Execution duration of the operation in milliseconds.
11. `status_code`: HTTP or system response status code.
12. `error_details`: Object containing error code, message, and stack trace when `log_level` is `ERROR` or `FATAL` (null otherwise).