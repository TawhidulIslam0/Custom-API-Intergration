
---

# 6. `docs/D3_Data_Transformation_Specification_v1.md`

One important correction here: your previous version said **81 mappings**, but the table you provided actually adds up to 81, so that's good. Keep the exact inventory consistent.

```markdown
# Data Transformation Specification

**Project:** FDE-9B Integration  
**Source:** SAP S/4HANA  
**Destination:** Zetheta FinSight  
**Version:** 1.1  
**Status:** Final

---

## 1. Overview

This document defines the field-level transformation framework bridging
SAP S/4HANA source interfaces SRC-001 through SRC-012 to Zetheta FinSight
destination interfaces DST-001 through DST-012.

The completed mapping inventory contains:

**81 field mappings**

across 12 source/destination domains.

---

## 2. Mapping Coverage

| Domain | Source | Destination | Mappings |
|---|---|---|---:|
| General Ledger | SRC-001 | DST-001 | 14 |
| Accounts Payable | SRC-002 | DST-002 | 11 |
| Accounts Receivable | SRC-003 | DST-003 | 8 |
| Cost Centre | SRC-004 | DST-004 | 6 |
| Profit Centre | SRC-005 | DST-005 | 4 |
| Material Ledger | SRC-006 | DST-006 | 5 |
| Purchase Orders | SRC-007 | DST-007 | 4 |
| Sales Orders | SRC-008 | DST-008 | 3 |
| Fixed Assets | SRC-009 | DST-009 | 3 |
| Bank Statements | SRC-010 | DST-010 | 3 |
| Budget vs Actual | SRC-011 | DST-011 | 10 |
| Inventory | SRC-012 | DST-012 | 10 |
| **Total** | | | **81** |

---

## 3. Transformation Categories

The mapping framework supports:

- Direct field mapping
- Type conversion
- ISO date conversion
- Currency normalization
- Lookup/value mapping
- Composite key generation
- Hierarchical flattening
- Calculated fields
- Default-value assignment
- Data-quality validation

---

## 4. Mapping Contract

Every mapping should define:

1. Mapping ID
2. Source system
3. Source interface
4. Source field
5. Target system
6. Destination interface
7. Target field
8. Transformation rule
9. Validation constraint
10. Error-handling behavior
11. Business context

---

## 5. Validation

Validation is applied before destination ingestion.

Validation categories include:

- Required-field validation
- String length validation
- Numeric validation
- Date validation
- ISO 4217 currency validation
- Lookup validation
- Referential integrity
- Range validation
- Business-rule validation

Invalid or unrecoverable records are routed to the appropriate DLQ or
business exception workflow.

---

## 6. Currency Conversion

Currency normalization uses SAP `TCURR` exchange-rate data.

Formula:

```text
TargetAmount = SourceAmount × ExchangeRate