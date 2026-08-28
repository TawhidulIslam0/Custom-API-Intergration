# Deliverable 3: Data Transformation Specification

## Overview
This document defines field-level mappings from SAP S/4HANA source tables to
the Zetheta FinSight target schema, across 10 data domains. Each mapping
includes the transformation rule, validation logic, and business context.

Total mappings: 56 (exceeds the 50 minimum requirement)

---

## Domain 1: General Ledger (12 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-GL-001 | ACDOCA.BELNR | journalEntry.documentId | CONCAT(BUKRS,'-',GJAHR,'-',LTRIM(BELNR,'0')) | NOT NULL; regex `^[A-Z0-9]{2,6}-\d{4}-\d{1,10}$` |
| MAP-GL-002 | ACDOCA.BUDAT | journalEntry.postingDate | FORMAT(BUDAT, 'YYYY-MM-DD') from SAP YYYYMMDD | NOT NULL; within fiscal year +/- 1 month |
| MAP-GL-003 | ACDOCA.BLDAT | journalEntry.documentDate | FORMAT(BLDAT, 'YYYY-MM-DD') | NOT NULL; <= postingDate + 30 days |
| MAP-GL-004 | ACDOCA.RACCT | journalEntry.glAccount | LTRIM(RACCT,'0') then lookup analytics CoA mapping | Must exist in target CoA master |
| MAP-GL-005 | ACDOCA.HSL | journalEntry.amountLC | DECIMAL(HSL, 2) group currency | NOT NULL; range -999999999.99 to 999999999.99 |
| MAP-GL-006 | ACDOCA.WSL | journalEntry.amountTC | DECIMAL(WSL, 2) transaction currency | NOT NULL; same range as amountLC |
| MAP-GL-007 | ACDOCA.RHCUR | journalEntry.localCurrency | Direct mapping, validate ISO 4217 | Must be valid 3-letter ISO 4217 |
| MAP-GL-008 | ACDOCA.RWCUR | journalEntry.transactionCurrency | Direct mapping, validate ISO 4217 | Must be valid 3-letter ISO 4217 |
| MAP-GL-009 | ACDOCA.KOSTL | journalEntry.costCentre | LTRIM(KOSTL,'0') then validate against CC master | If present, must exist in CC dimension |
| MAP-GL-010 | ACDOCA.PRCTR | journalEntry.profitCentre | LTRIM(PRCTR,'0') then validate against PC master | If present, must exist in PC dimension |
| MAP-GL-011 | ACDOCA.MONAT | journalEntry.fiscalPeriod | MAP SAP period 001-012 to calendar month; 013-016 map to 012 with specialPeriod=true | Range 001-016; flag special periods |
| MAP-GL-012 | ACDOCA.BLART + BKPF.STBLG | journalEntry.documentType | MAP BLART to analytics type enum; if STBLG populated, isReversal=true | Must map to valid analytics document type |

---

## Domain 2: Accounts Payable (8 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-AP-001 | BSIK.LIFNR | accountsPayable.vendorId | LTRIM(LIFNR,'0') | NOT NULL; must exist in vendor master (LFA1) |
| MAP-AP-002 | BSIK.BUKRS | accountsPayable.companyCode | Direct mapping | NOT NULL; must be MC01/MC02/MC03 |
| MAP-AP-003 | BSIK.DMBTR | accountsPayable.amount | DECIMAL(DMBTR, 2) | NOT NULL; must be positive |
| MAP-AP-004 | BSIK.AUGDT | accountsPayable.clearingDate | FORMAT(AUGDT,'YYYY-MM-DD') if populated, else NULL | Nullable; if present must be >= postingDate |
| MAP-AP-005 | BSIK.BUDAT (derived) | accountsPayable.ageingBucket | CALC: DAYS(TODAY - BUDAT) → bucket [0-30, 31-60, 61-90, 90+] | Must be one of 4 valid buckets |
| MAP-AP-006 | LFA1.NAME1 | accountsPayable.vendorName | Direct mapping via vendor master lookup | NOT NULL after enrichment |
| MAP-AP-007 | LFA1.STCD1 | accountsPayable.vendorGSTIN | Direct mapping, validate GSTIN format | Regex `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$` |
| MAP-AP-008 | BSIK.ZUONR | accountsPayable.assignmentReference | Direct mapping | Nullable |

---

## Domain 3: Accounts Receivable (8 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-AR-001 | BSID.KUNNR | accountsReceivable.customerId | LTRIM(KUNNR,'0') | NOT NULL; must exist in customer master (KNA1) |
| MAP-AR-002 | BSID.BUKRS | accountsReceivable.companyCode | Direct mapping | NOT NULL; must be MC01/MC02/MC03 |
| MAP-AR-003 | BSID.DMBTR | accountsReceivable.amount | DECIMAL(DMBTR, 2) | NOT NULL; must be positive |
| MAP-AR-004 | BSID.AUGDT | accountsReceivable.clearingDate | FORMAT(AUGDT,'YYYY-MM-DD') if populated | Nullable |
| MAP-AR-005 | KNA1.NAME1 | accountsReceivable.customerName | Direct mapping via customer master lookup | NOT NULL after enrichment |
| MAP-AR-006 | (derived) | accountsReceivable.creditLimit | Lookup from customer credit management (FD32) | Nullable; must be >= 0 if present |
| MAP-AR-007 | (derived) | accountsReceivable.dunningLevel | Lookup from dunning history (MHNK) | Range 0-9 |
| MAP-AR-008 | KNA1.STCD1 | accountsReceivable.customerGSTIN | Direct mapping, validate GSTIN format | Same regex as MAP-AP-007 |

---

## Domain 4: Cost Centre Accounting (6 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-CC-001 | CSKS.KOSTL | costCentre.costCentreId | LTRIM(KOSTL,'0') | NOT NULL; unique per company code |
| MAP-CC-002 | CSKT.KTEXT | costCentre.name | Direct mapping (language filter SPRAS='EN') | NOT NULL |
| MAP-CC-003 | CSKS.BUKRS | costCentre.companyCode | Direct mapping | NOT NULL |
| MAP-CC-004 | SETNODE/SETLEAF hierarchy | costCentre.hierarchyLevel | Flatten hierarchy: traverse SETNODE parent-child, assign depth level | Integer 1-7 |
| MAP-CC-005 | SETNODE/SETLEAF hierarchy | costCentre.parentCostCentre | Traverse hierarchy for immediate parent node | Nullable for level-1 nodes |
| MAP-CC-006 | CSKS.VERAK | costCentre.responsiblePerson | Direct mapping | Nullable |

---

## Domain 5: Profit Centre Accounting (4 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-PC-001 | CEPC.PRCTR | profitCentre.profitCentreId | LTRIM(PRCTR,'0') | NOT NULL; unique per controlling area |
| MAP-PC-002 | CEPCT.KTEXT | profitCentre.name | Direct mapping (SPRAS='EN') | NOT NULL |
| MAP-PC-003 | CEPC.SEGMENT | profitCentre.segment | Direct mapping, used for segment reporting | Must match a defined business segment |
| MAP-PC-004 | CEPC.BUKRS | profitCentre.companyCode | Direct mapping | NOT NULL |

---

## Domain 6: Material Ledger (5 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-ML-001 | MBEW.MATNR | materialValuation.materialId | Direct mapping | NOT NULL; must exist in material master |
| MAP-ML-002 | MBEW.VERPR | materialValuation.movingAvgPrice | DECIMAL(VERPR, 2) | NOT NULL; must be >= 0 |
| MAP-ML-003 | MBEW.STPRS | materialValuation.standardPrice | DECIMAL(STPRS, 2) | Nullable; must be >= 0 if present |
| MAP-ML-004 | MBEW.LBKUM | materialValuation.stockQuantity | DECIMAL(LBKUM, 3) | NOT NULL; must be >= 0 |
| MAP-ML-005 | MBEW.SALK3 | materialValuation.totalStockValue | DECIMAL(SALK3, 2); calc = VERPR * LBKUM for reconciliation check | Must equal VERPR × LBKUM within tolerance 0.01 |

---

## Domain 7: Procurement / Purchase Orders (4 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-PO-001 | EKKO.EBELN | purchaseOrder.poNumber | Direct mapping | NOT NULL; unique |
| MAP-PO-002 | EKPO.NETPR | purchaseOrder.netPrice | DECIMAL(NETPR, 2), condition pricing extraction from KONV | NOT NULL; must be >= 0 |
| MAP-PO-003 | EKET.WEMNG vs EKPO.MENGE | purchaseOrder.grIrStatus | CALC: IF WEMNG >= MENGE THEN 'COMPLETE' ELSE 'PARTIAL' | Must be COMPLETE/PARTIAL/PENDING |
| MAP-PO-004 | EKKO.LIFNR | purchaseOrder.vendorId | LTRIM(LIFNR,'0') | NOT NULL; must exist in vendor master |

---

## Domain 8: Sales Orders (3 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-SO-001 | VBAK.VBELN | salesOrder.soNumber | Direct mapping | NOT NULL; unique |
| MAP-SO-002 | VBAP.NETWR | salesOrder.netValue | DECIMAL(NETWR, 2) | NOT NULL; must be >= 0 |
| MAP-SO-003 | VBEP.EDATU vs actual delivery | salesOrder.revenueRecognitionStage | MAP delivery/billing status to stage enum [BOOKED, DELIVERED, INVOICED] | Must be one of 3 valid stages |

---

## Domain 9: Fixed Assets (3 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-FA-001 | ANLA.ANLN1 + ANLN2 | fixedAsset.assetId | CONCAT(ANLN1,'-',ANLN2) | NOT NULL; unique |
| MAP-FA-002 | ANLA.TXT50 | fixedAsset.description | Direct mapping | NOT NULL |
| MAP-FA-003 | ANLP (depreciation) | fixedAsset.depreciationMethod | Lookup depreciation key from asset class config | Must map to valid depreciation method enum |

---

## Domain 10: Bank Statements (3 mappings)

| Map ID | Source Field | Target Field | Transformation | Validation |
|--------|-------------|---------------|-----------------|------------|
| MAP-BS-001 | FEBEP.KWBTR | bankStatement.statementAmount | DECIMAL(KWBTR, 2) | NOT NULL |
| MAP-BS-002 | FEBEP.VALUT | bankStatement.valueDate | FORMAT(VALUT,'YYYY-MM-DD') | NOT NULL |
| MAP-BS-003 | FEBEP (matched flag) | bankStatement.clearingStatus | IF matched to open item THEN 'CLEARED' ELSE 'OPEN' | Must be CLEARED or OPEN |

---

## Advanced Transformation Patterns

### Currency Conversion
All amounts are extracted already in local currency (HSL field, group currency)
from ACDOCA, avoiding the need for separate conversion in most cases. Where
transaction currency differs (WSL/RWCUR), point-in-time exchange rates are
sourced from TCURR using the posting date. If no exact-date rate exists, the
nearest prior date's rate is used with a `stale-rate` flag set to true.

### Hierarchy Flattening Algorithm
Cost centre and profit centre hierarchies are stored in SAP as parent-child
sets (SETNODE/SETLEAF). The flattening algorithm performs a recursive
top-down traversal, assigning each node a `hierarchyLevel` (1 = top) and
`parentCostCentre` reference, producing a denormalized table suitable for
FinSight's dimensional model (star schema).

### Fiscal-to-Calendar Period Mapping
Meridian uses SAP fiscal year variant V3 (April-March). SAP periods 001-012
map directly to calendar months (period 001 = April). Special periods
013-016 (year-end adjustments) are mapped to period 012 with a
`specialPeriod: true` flag so they don't distort monthly trend analysis
while remaining available for annual reconciliation.

### GST Breakdown Preservation
Per the project's compliance requirement, any transformation touching
invoice amounts must preserve CGST/SGST/IGST breakdown. These are extracted
as separate line items from the tax condition table (KONV) and carried
through as three explicit fields (`cgstAmount`, `sgstAmount`, `igstAmount`)
rather than being netted into a single tax figure.