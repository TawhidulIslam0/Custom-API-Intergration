# Technical Design Review for Platform Engineering

## Overview
This document provides Platform Engineering and backend developers with a comprehensive architectural and technical design review of the SAP S/4HANA to Zetheta FinSight integration platform.

## API Contracts & Specifications
* **Source Endpoints**: OpenAPI 3.0 specs covering General Ledger, AP, AR, Cost Centres, and Asset Accounting (`api-specs/source-endpoints-part1.yaml`, `api-specs/source-endpoints-part2.yaml`).
* **Destination Endpoints**: FinSight ingestion APIs (DST-001 through DST-012) adhering to strict JSON schema validation (`api-specs/destination-endpoints-part1.yaml`, `api-specs/destination-endpoints-part2.yaml`).

## Authentication & Security Flow
* **OAuth 2.0 Client Credentials**: Secure token generation with automated token caching, short-lived expiry windows, and transparent background refresh (`diagrams/sequences/seq-04-oauth-flow-1.png`).
* **Mutual TLS (mTLS)**: Enforced across inter-service communication within Kubernetes clusters and external API gateways.

## Throughput Expectations & Platform Limitations
* **Ingestion Throughput**: Designed to support up to 5,000 transactions per second during peak delta extraction windows.
* **Payload Limitations**: Maximum single payload size capped at 10MB; larger datasets must utilize chunked streaming or Kafka batching.
* **Latency SLA**: P99 end-to-end processing latency under 500ms from source extraction to destination commit.