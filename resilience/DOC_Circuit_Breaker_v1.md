
---

# 8. `resilience/DOC_Circuit_Breaker_v1.md`

Replace the entire file:

```markdown
# Circuit Breaker Specification

**Project:** FDE-9B Integration  
**Version:** 1.1  
**Status:** Final

---

## 1. Purpose

The circuit breaker prevents repeated requests to an unhealthy downstream
FinSight service.

It protects the integration platform from cascading failures and allows
a failed dependency time to recover.

---

## 2. States

The circuit breaker has three states:

```text
CLOSED
OPEN
HALF-OPEN