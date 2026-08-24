# Functional Test Scenarios (Scenarios F-01 to F-10)

## Overview
This document specifies the 10 functional test scenarios for validating end-to-end data ingestion, transformation, and processing between SAP S/4HANA and Zetheta FinSight.

## Scenarios
1. **F-01: Happy Path GL Extraction**
   * **Objective**: Verify extraction, transformation, and ingestion of standard General Ledger line items.
   * **Input**: SAP S/4HANA ODP delta extraction for GL (SRC-001).
   * **Expected Result**: 100% of GL records successfully ingested into FinSight (DST-001) with zero variance.

2. **F-02: Accounts Payable Sync**
   * **Objective**: Validate AP invoice extraction and ageing calculations.
   * **Input**: Vendor invoice payloads from SRC-002.
   * **Expected Result**: Correct calculation of ageing brackets and successful posting to FinSight AP destination (DST-002).

3. **F-03: Master Data Delta Processing**
   * **Objective**: Test incremental delta changes for profit and cost centers.
   * **Input**: ODP delta records for master data (SRC-003).
   * **Expected Result**: Destination master data tables updated without duplicate creation.

4. **F-04: Multi-Company Code Handling**
   * **Objective**: Ensure transactions spanning multiple company codes maintain segregation and correct currency mapping.
   * **Input**: Cross-company batch extract from SAP.
   * **Expected Result**: Proper routing and tagging of company code metadata in FinSight.

5. **F-05: Fiscal Period Mapping**
   * **Objective**: Validate special fiscal periods (periods 13–16) mapping.
   * **Input**: Year-end adjustment postings.
   * **Expected Result**: Correctly mapped to year-end closing periods in FinSight.

6. **F-06: Hierarchy Flattening**
   * **Objective**: Test cost center hierarchy flattening from SAP tree structures into flat relational records.
   * **Input**: Cost center group hierarchy payload (SRC-004).
   * **Expected Result**: Flat parent-child relational mappings correctly populated.

7. **F-07: Procure-to-Pay (P2P) Flow**
   * **Objective**: Validate end-to-end P2P flow from Purchase Order to Goods Receipt and Invoice Receipt (GR/IR) reconciliation.
   * **Input**: PO and GR/IR records (SRC-005).
   * **Expected Result**: GR/IR clearing status correctly reconciled in FinSight.

8. **F-08: Bank Statement Normalization**
   * **Objective**: Test raw bank statement file ingestion and format normalization.
   * **Input**: Multicash/BAI2 format bank statements (SRC-006).
   * **Expected Result**: Normalized transaction records ingested with correct sign conventions.

9. **F-09: Budget vs. Actuals Aggregation**
   * **Objective**: Verify calculation and alignment of budget figures against actual ledger postings.
   * **Input**: Controlling budget data and actual GL lines.
   * **Expected Result**: Variance reports correctly generated in FinSight analytics endpoints.

10. **F-10: End-of-Day Reconciliation**
    * **Objective**: Validate automated EOD reconciliation job execution and completeness checks.
    * **Input**: End-of-day batch extraction logs.
    * **Expected Result**: Reconciliation report generated with 0% variance status.