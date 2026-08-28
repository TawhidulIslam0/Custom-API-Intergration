# Deliverable 2: API Specification Document

## Overview
This document covers the complete API contract for the SAP-to-FinSight integration:
12 source extraction endpoints (SAP) and 12 destination load endpoints (FinSight).

## Source API (SAP S/4HANA)
- Spec file: `api-specs/API_SAP_Source.yaml`
- Authentication: OAuth 2.0 Client Credentials
- Extraction pattern: ODP delta extraction with token-based incremental pull
- Rate limiting: Governed by SAP RFC pool (max 50 concurrent connections)
- See Postman collection: `api-specs/SAP_Source.postman_collection.json`

## Destination API (Zetheta FinSight)
- Spec file: `api-specs/API_FinSight_Destination.yaml`
- Authentication: OAuth 2.0 Client Credentials, tokens expire in 3600s
- Idempotency: All POST requests require an `Idempotency-Key` header (documentId)
- Rate limiting: Respects `Retry-After` header on HTTP 429
- See Postman collection: `api-specs/FinSight_Destination.postman_collection.json`

## Authentication Flow
See `diagrams/sequences/DGM_SEQ_OAuthFlow.png` for the complete token lifecycle,
including proactive refresh 300 seconds before expiry to avoid mid-batch failures.

## Linting
Both specifications pass Spectral's `spectral:oas` ruleset with zero errors
and zero warnings.

## Error Handling
Full error code mapping is defined in Appendix B of the project brief and
implemented in Deliverable 4 (Error Handling Framework).