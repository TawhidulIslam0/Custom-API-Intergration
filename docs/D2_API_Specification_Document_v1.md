# Integration Architecture & API Specifications (Deliverable 2)

## 1. Executive Summary
This document consolidates the complete API specifications for the 15-day integration project between SAP S/4HANA and Zetheta FinSight. It covers all 12 source endpoints (`SRC-001` to `SRC-012`) and 12 destination endpoints (`DST-001` to `DST-012`).

## 2. Source Endpoints Summary (SAP S/4HANA)
* **Financials & Controlling (SRC-001 to SRC-006):** GL, AP, AR, Cost Centre, Profit Centre, and Material Ledger utilizing ODP CDS views with delta token tracking.
* **Operations & Assets (SRC-007 to SRC-012):** Purchase Orders, Sales Orders, Fixed Assets, Bank Statements, Budget vs Actual, and Inventory.

## 3. Destination Endpoints Summary (Zetheta FinSight)
* **Ingestion Inbound (DST-001 to DST-012):** Secure REST endpoints requiring `X-Idempotency-Key` and OAuth 2.0 Client Credentials authentication, supported by asynchronous webhook callback notifications.