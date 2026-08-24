# SAP S/4HANA Source API Documentation

## Overview
This document specifies the extraction mechanisms for all 12 source endpoints (`SRC-001` through `SRC-012`) connecting Meridian Manufacturing's SAP S/4HANA ERP to the integration middleware.

## Authentication & Security
* **Protocol:** OAuth 2.0 Client Credentials Grant / SAP SNC (Secure Network Communications).
* **Credentials Rotation:** Managed via AWS Secrets Manager with a 30-day rotation cycle.

## Rate Limiting & Performance
* **Concurrency Limit:** Maximum 50 concurrent RFC connection threads.
* **Throttling:** Exponential backoff applied if SAP gateway returns HTTP 429 or RFC system busy errors.

## Endpoints Summary
* **SRC-001 to SRC-006:** Financials & Controlling (GL, AP, AR, Cost Centre, Profit Centre, Material Ledger).
* **SRC-007 to SRC-012:** Operations & Assets (Purchase Orders, Sales Orders, Fixed Assets, Bank Statements, Budget vs Actual, Inventory).