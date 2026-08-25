# Security & Reconciliation Test Scenarios (Scenarios SEC-01 to SEC-04, REC-01 to REC-03)

## Overview
This document specifies 4 security test scenarios and 3 reconciliation test scenarios validating token security, unauthorized access blocks, data encryption, and financial variance detection.

## Security Scenarios
1. **SEC-01: Token Expiry and Refresh**
   * **Objective**: Verify automated token refresh handling when OAuth 2.0 access tokens expire.
   * **Input**: API requests made with an expired bearer token.
   * **Expected Result**: System automatically fetches a new token using valid client credentials and completes the request without user intervention.

2. **SEC-02: Unauthorized Access Block**
   * **Objective**: Validate that requests without valid credentials or insufficient scopes are blocked.
   * **Input**: API request payloads bearing invalid or missing API keys/tokens.
   * **Expected Result**: Endpoints reject requests with an HTTP 401 Unauthorized or HTTP 403 Forbidden status.

3. **SEC-03: Encryption Verification**
   * **Objective**: Ensure all sensitive financial payloads are encrypted both in transit and at rest.
   * **Input**: Packet capture inspection on communication channels and database storage check.
   * **Expected Result**: TLS 1.3 enforced for all transport channels; AES-256 encryption confirmed for database storage.

4. **SEC-04: API Rate Limiting & DDoS Defense**
   * **Objective**: Validate that the API gateway correctly throttles and blocks malicious or excessive request volumes from a single client IP.
   * **Input**: Sustained stream of 1,000 requests per second originating from a single unauthenticated or untrusted source IP.
   * **Expected Result**: API gateway intercepts the traffic, applies rate-limiting policies, and returns an HTTP 429 Too Many Requests response without impacting core pipeline performance.

## Reconciliation Scenarios
1. **REC-01: Financial Variance Detection**
   * **Objective**: Test automated detection of numerical discrepancies between source ledger totals and destination totals.
   * **Input**: Ingested batch data featuring a deliberate $0.05 rounding variance.
   * **Expected Result**: Automated reconciliation engine flags the mismatch, generates an alert, and routes the discrepancy to the audit queue.

2. **REC-02: Completeness Check**
   * **Objective**: Verify that 100% of extracted source transaction counts match ingested destination records.
   * **Input**: Batch extract log containing 10,000 line items.
   * **Expected Result**: Count verification confirms zero dropped or duplicated records.

3. **REC-03: Cross-Currency FX Rate Discrepancy**
   * **Objective**: Validate reconciliation behavior when minor rounding variances occur due to differing daily spot exchange rates between SAP and FinSight.
   * **Input**: Transaction batch processed with a 0.02% FX rate conversion discrepancy.
   * **Expected Result**: Automated reconciliation engine flags the discrepancy, validates it against the pre-configured tolerance threshold, and routes it to the warning log rather than failing the batch.