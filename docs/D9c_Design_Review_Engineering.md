# Platform Engineering Design Review
**Prepared for: Marcus Wei, Zetheta Platform Engineer**

## Section 1: API Contract
Full OpenAPI 3.0 specs (both directions) linted clean via `spectral:oas`:
- Source: `api-specs/API_SAP_Source.yaml` (12 GET endpoints)
- Destination: `api-specs/API_FinSight_Destination.yaml` (12 POST endpoints + webhook subscription)

Example request (loading a journal entry):

    curl -X POST https://api.finsight.zetheta.com/v1/journal-entries \
      -H "Authorization: Bearer {token}" \
      -H "Idempotency-Key: MC01-2026-5000000001" \
      -H "Content-Type: application/json" \
      -d '{
        "documentId": "MC01-2026-5000000001",
        "postingDate": "2026-03-15",
        "glAccount": "400000",
        "amountLC": 45230.50,
        "localCurrency": "INR",
        "type": "DEBIT"
      }'

## Section 2: Authentication Flow
OAuth 2.0 Client Credentials grant. Tokens expire in 3600s; integration platform refreshes proactively at the 300s-remaining mark to avoid mid-batch auth failures. Full sequence: `diagrams/sequences/DGM_SEQ_OAuthFlow.png`.

## Section 3: Throughput Expectations
- Peak: ~500K GL records/batch during month-end close (per NFR test TST-NFR-001)
- Average: ~2.1M transactions/month across all domains, spread across daily batches
- Batch size: configurable, default 1000 records/page for source extraction

## Section 4: Platform Limitations Encountered
- FinSight's `DUPLICATE_ENTRY` (409) response doesn't distinguish "identical payload, safe to skip" from "different payload, needs alert" — our loader handles this client-side by comparing payloads before deciding action
- No batch/bulk POST endpoint currently exists on FinSight; all loads are single-record POSTs with idempotency keys. At peak volume this means higher request counts than ideal — flagging as a potential platform enhancement

## Section 5: Proposed Changes
- Request: a bulk ingestion endpoint (`POST /journal-entries/batch`) to reduce request overhead at scale
- Request: webhook payload should include a `reconciliationHint` field with expected record count, so downstream reconciliation doesn't need a separate query

## Section 6: Engineering Support Requests
- Confirm sandbox rate limits match production (currently untested)
- Confirm FinSight's webhook retry behavior on delivery failure (not documented in current API reference)