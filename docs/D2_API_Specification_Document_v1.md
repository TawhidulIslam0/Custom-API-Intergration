# D2 - API Specification Document

**Project:** FDE-9B Integration  
**Client:** Meridian Manufacturing  
**Integration:** SAP S/4HANA → Zetheta FinSight  
**Version:** 1.0  
**Status:** Complete Draft  
**Date:** 2026-08-24

---

## 1. Executive Summary

This document defines the API contract for the Meridian Manufacturing SAP
S/4HANA to Zetheta FinSight integration.

The integration exposes:

- 12 SAP S/4HANA source extraction interfaces (`SRC-001` to `SRC-012`)
- 12 Zetheta FinSight destination ingestion interfaces (`DST-001` to `DST-012`)

The APIs support:

- OAuth 2.0 authentication
- ODP delta extraction
- Pagination
- Correlation IDs
- Rate limiting
- Idempotent destination ingestion
- Standardised error responses
- Asynchronous FinSight processing
- Webhook-based processing notifications
- Retry and resilience handling

---

# 2. API Inventory

## 2.1 SAP Source Interfaces

| ID | Domain | Method | Purpose |
|---|---|---|---|
| SRC-001 | General Ledger | GET | Journal entry extraction |
| SRC-002 | Accounts Payable | GET | AP line-item extraction |
| SRC-003 | Accounts Receivable | GET | AR line-item extraction |
| SRC-004 | Cost Centre | GET | Cost centre master/hierarchy |
| SRC-005 | Profit Centre | GET | Profit centre master |
| SRC-006 | Material Ledger | GET | Actual costing and valuation |
| SRC-007 | Purchase Orders | GET | PO and GR/IR extraction |
| SRC-008 | Sales Orders | GET | Sales order and revenue data |
| SRC-009 | Fixed Assets | GET | Asset master and depreciation |
| SRC-010 | Bank Statements | GET | Electronic bank statement data |
| SRC-011 | Budget vs Actual | GET | Budget and actual controlling data |
| SRC-012 | Inventory | GET | Inventory valuation and movements |

---

## 2.2 FinSight Destination Interfaces

| ID | Domain | Method | Purpose |
|---|---|---|---|
| DST-001 | General Ledger | POST | GL journal ingestion |
| DST-002 | Accounts Payable | POST | AP ingestion |
| DST-003 | Accounts Receivable | POST | AR ingestion |
| DST-004 | Cost Centre | POST | Cost centre ingestion |
| DST-005 | Profit Centre | POST | Profit centre ingestion |
| DST-006 | Material Ledger | POST | Material ledger ingestion |
| DST-007 | Purchase Orders | POST | PO and GR/IR ingestion |
| DST-008 | Sales Orders | POST | Sales order ingestion |
| DST-009 | Fixed Assets | POST | Asset/depreciation ingestion |
| DST-010 | Bank Statements | POST | Bank statement ingestion |
| DST-011 | Budget vs Actual | POST | Budget/actual ingestion |
| DST-012 | Inventory | POST | Inventory ingestion |

---

# 3. Source API Specification

## 3.1 Authentication

SAP extraction requests use OAuth 2.0 Client Credentials authentication.

Required scope:

```text
sap:extract