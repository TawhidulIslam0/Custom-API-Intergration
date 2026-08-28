# Deliverable 7: Integration Testing Plan

## Overview
25 test scenarios covering functional (10), non-functional (5), failure
injection (5), security (3), and reconciliation (2) categories, per
Appendix G of the project brief. Full details of expected results are in
that appendix; this document adds the traceability matrix and automation
status.

## Traceability Matrix

| Test ID | Category | Covers Requirement | Automated? |
|---------|----------|---------------------|------------|
| TST-FNC-001 | Functional | GL extraction happy path | Yes — `scripts/test-pipeline.js` |
| TST-FNC-002 | Functional | AP multi-currency | Partial — transform logic only |
| TST-FNC-003 | Functional | Master data delta sync | Manual |
| TST-FNC-004 | Functional | Multi-company-code routing | Yes |
| TST-FNC-005 | Functional | Fiscal period mapping | Yes — see `scripts/test-fiscal-mapping.js` |
| TST-FNC-006 | Functional | 7-level hierarchy flattening | Manual |
| TST-FNC-007 | Functional | P2P flow tracing | Manual |
| TST-FNC-008 | Functional | Bank statement load | Manual |
| TST-FNC-009 | Functional | Budget vs actual variance | Manual |
| TST-FNC-010 | Functional | End-of-day full reconciliation | Yes — `scripts/test-reconciliation.js` |
| TST-NFR-001 to 005 | Non-functional | Performance, concurrency, latency, scalability, endurance | Manual (requires load testing tools) |
| TST-FLR-001 to 005 | Failure injection | RFC failure, 429, Kafka failure, malformed data, network partition | Yes (partial) — `scripts/test-resilience.js` |
| TST-SEC-001 to 003 | Security | Token expiry, invalid tokens, encryption | Manual |
| TST-REC-001 to 002 | Reconciliation | Deliberate discrepancy, orphan reference | Yes — `scripts/test-reconciliation.js` |

## Test Data Requirements

- SAP sandbox with sample GL entries across 3 company codes
- Vendor/customer master data with at least one intentionally invalid GSTIN
- A 7-level cost centre hierarchy for flattening tests
- Deliberately malformed records (missing fields, bad dates) for DQ tests

Full scenario details (preconditions, steps, expected results) for all 25
tests are documented in Appendix G of the project brief and are followed
exactly for this project.