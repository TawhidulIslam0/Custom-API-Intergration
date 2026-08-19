# Non-Functional Requirements (NFRs): FDE-9B Integration Middleware

## 1. Performance & Latency
* **Throughput**: The middleware must process a minimum of 500 financial and operational records per minute during peak batch extractions from SAP S/4HANA.
* **Latency**: Real-time webhook notifications and API passthrough responses must complete within an average round-trip time of under 500ms.

## 2. Scalability
* **Horizontal Scaling**: Containerized instances deployed via Docker/Kubernetes must support auto-scaling based on CPU utilization and Kafka consumer lag.
* **Data Volume**: Architecture must gracefully handle daily transaction loads exceeding 100,000 records without memory degradation.

## 3. Security & Compliance
* **Data in Transit**: All communications between SAP S/4HANA, the integration middleware, and Zetheta FinSight must be encrypted using TLS 1.3.
* **Authentication**: Mutual TLS (mTLS) and OAuth 2.0 token-based authentication must be enforced across all API endpoints.
* **Secrets Management**: Sensitive credentials (database strings, API keys) must be stored securely using environment variables and secret managers, never hardcoded.

## 4. Availability & Reliability
* **Uptime**: The integration pipeline must maintain a 99.9% availability SLA during business operational hours.
* **Fault Tolerance & DLQ**: Failed extraction or transformation transactions must be automatically retried up to 3 times before being routed to a Dead Letter Queue (DLQ) for manual audit and replay.