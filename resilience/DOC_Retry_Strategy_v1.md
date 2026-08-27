
---

# 7. `resilience/DOC_Retry_Strategy_v1.md`

Replace the entire file:

```markdown
# Retry Strategy

**Project:** FDE-9B Integration  
**Version:** 1.1  
**Status:** Final

---

## 1. Purpose

The retry framework protects the integration pipeline against transient
failures while preventing uncontrolled retry storms.

Retries are used only when the failure is considered recoverable.

---

## 2. Maximum Attempts

The integration performs a maximum of **3 total attempts** for a
retryable transaction.

```text
Attempt 1
   ↓
Failure
   ↓
Backoff
   ↓
Attempt 2
   ↓
Failure
   ↓
Backoff
   ↓
Attempt 3
   ↓
Success → Continue
Failure → DLQ / Failure Handling