# Deliverable 5: Reconciliation Logic & Data Quality Rules

## 1. Reconciliation Dimensions

| Dimension | Method | Tolerance |
|-----------|--------|-----------|
| Completeness | Record count: source extracted vs. target loaded (accounting for DLQ) | 0 unexplained variance |
| Accuracy | Checksum: SUM(debits) vs SUM(credits) per batch, source vs target | INR 1.00 |
| Timeliness | Batch completion time vs. SLA window | 0 misses/month |
| Consistency | Cross-reference resolution: GL→CC, GL→PC, PO→Vendor | 100% resolve |

## 2. Report Formats

### Batch Reconciliation Report (per extraction cycle)
Generated after every batch load. Includes: batch ID, timestamps, record
counts (extracted/validated/loaded/skipped), debit/credit checksums
(source vs target), variance, top error codes, DLQ routing count.
Template: see Appendix D of project brief.

### Daily Reconciliation Dashboard
Aggregates all batches in a 24hr window per domain. Shows RECONCILED vs
BREAK status trend, cumulative DLQ depth, and SLA compliance percentage.

### Monthly Audit Report
Rolls up daily reconciliation into a monthly view for Dr. Kulkarni's audit
team — full traceability chain from SAP document number to FinSight record,
satisfying the audit trail requirement in Section B8.3.

## 3. Automated Reconciliation Process

1. After each batch load completes, Reconciliation Service triggers automatically
2. Compares source and target checksums (see `scripts/reconcile.js`)
3. If within tolerance → status RECONCILED, logged to audit trail
4. If variance exceeds tolerance → status BREAK, generates variance report,
   alerts Data Steward (P2), pauses downstream dependent jobs for that domain
5. Human intervention required only on BREAK status — clean batches need
   no manual touch, satisfying the "automated reconciliation" bonus badge

## 4. Data Quality Rules (25 rules across 6 categories)

### Null Checks (5)
| Rule ID | Field | Rule |
|---------|-------|------|
| DQ-NULL-001 | journalEntry.documentId | Must not be NULL or empty string |
| DQ-NULL-002 | journalEntry.postingDate | Must not be NULL |
| DQ-NULL-003 | journalEntry.amountLC | Must not be NULL |
| DQ-NULL-004 | accountsPayable.vendorId | Must not be NULL |
| DQ-NULL-005 | costCentre.costCentreId | Must not be NULL |

### Format Validation (5)
| Rule ID | Field | Rule |
|---------|-------|------|
| DQ-FMT-001 | journalEntry.postingDate | Must match YYYY-MM-DD |
| DQ-FMT-002 | journalEntry.localCurrency | Must be valid ISO 4217 code |
| DQ-FMT-003 | accountsPayable.vendorGSTIN | Must match GSTIN regex pattern |
| DQ-FMT-004 | journalEntry.documentId | Must match `^[A-Z0-9]{2,6}-\d{4}-\d{1,10}$` |
| DQ-FMT-005 | bankStatement.valueDate | Must match YYYY-MM-DD |

### Range Checks (4)
| Rule ID | Field | Rule |
|---------|-------|------|
| DQ-RNG-001 | journalEntry.amountLC | Between -999,999,999.99 and 999,999,999.99 |
| DQ-RNG-002 | journalEntry.fiscalPeriod | Between 001 and 016 |
| DQ-RNG-003 | materialValuation.stockQuantity | Must be >= 0 |
| DQ-RNG-004 | accountsReceivable.dunningLevel | Between 0 and 9 |

### Referential Integrity (5)
| Rule ID | Field | Rule |
|---------|-------|------|
| DQ-REF-001 | journalEntry.costCentre | Must exist in cost centre master |
| DQ-REF-002 | journalEntry.profitCentre | Must exist in profit centre master |
| DQ-REF-003 | journalEntry.glAccount | Must exist in target chart of accounts |
| DQ-REF-004 | accountsPayable.vendorId | Must exist in vendor master |
| DQ-REF-005 | purchaseOrder.vendorId | Must exist in vendor master |

### Cross-Field Validation (3)
| Rule ID | Fields | Rule |
|---------|--------|------|
| DQ-XFLD-001 | documentDate, postingDate | documentDate <= postingDate + 30 days |
| DQ-XFLD-002 | materialValuation | totalStockValue = movingAvgPrice × stockQuantity (tolerance 0.01) |
| DQ-XFLD-003 | purchaseOrder | grIrStatus must align with WEMNG vs MENGE comparison |

### Business Rules (3)
| Rule ID | Rule |
|---------|------|
| DQ-BIZ-001 | Sum of debit journalEntry.amountLC must equal sum of credit amountLC per document |
| DQ-BIZ-002 | GST breakdown (CGST+SGST+IGST) must equal total tax amount within INR 0.01 |
| DQ-BIZ-003 | Company code must be one of MC01, MC02, MC03 (no unrecognized entities) |