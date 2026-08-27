
---

# 2. `testing/TST_NonFunctional_01.md`

Replace the entire file with:

```markdown
# Non-Functional Test Scenarios

**Project:** FDE-9B Integration  
**Version:** 1.1  
**Status:** Final

---

## Overview

This document defines the non-functional testing strategy for performance,
latency, scalability, concurrency, and endurance.

The suite contains **5 scenarios (NF-01 to NF-05)**.

The tests are aligned with the project NFR targets.

---

## NF-01 — Peak Load Ingestion

**Objective:**  
Validate that the middleware can process the required baseline throughput
during peak batch extraction.

**Baseline Requirement:**

```text
Minimum throughput: 500 records/minute