# Error Classification Taxonomy

## 1. TRANSIENT
* **Description**: Temporary failures that are likely to succeed upon immediate or delayed retry.
* **Sub-categories**: Network timeout, rate-limiting (HTTP 429), downstream service unavailable (HTTP 503).

## 2. PERMANENT
* **Description**: Failures caused by structural or logical defects that will never succeed without intervention.
* **Sub-categories**: Unauthorized access (HTTP 401/403), resource not found (HTTP 404), unhandled schema mismatch.

## 3. DATA QUALITY
* **Description**: Failures due to invalid payloads, missing mandatory fields, or constraint violations.
* **Sub-categories**: Validation failure, malformed JSON, out-of-range numerical values, invalid ISO dates.

## 4. SYSTEM
* **Description**: Critical underlying infrastructure or hardware/software faults requiring immediate engineering intervention.
* **Sub-categories**: Out of memory (OOM), database connection pool exhaustion, unhandled exceptions.