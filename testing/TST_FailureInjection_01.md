
---

# 3. `testing/TST_FailureInjection_01.md`

Replace the entire file with:

```markdown
# Failure Injection Test Scenarios

**Project:** FDE-9B Integration  
**Version:** 1.1  
**Status:** Final

---

## Overview

This document specifies failure-injection scenarios used to validate
retries, circuit breakers, DLQ routing, broker resilience, network
recovery, and database transaction recovery.

The suite contains **6 scenarios (FI-01 to FI-06)**.

---

## FI-01 — SAP Connection Failure

**Objective:**  
Validate resilience when the SAP S/4HANA connection fails during
extraction.

**Input:**

```text
Forced SAP/network connection failure