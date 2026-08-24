# Advanced Transformation Patterns Documentation

## 1. Currency Conversion Rules
* **Exchange Rate Retrieval**: Fetches daily spot exchange rates from SAP table `TCURR` based on transaction currency and company code currency.
* **Calculation Formula**: `TargetAmount = SourceAmount * ExchangeRate`
* **Rounding Precision**: Standardized to 2 decimal places using HALF_UP rounding mode to comply with financial reporting regulations.

## 2. Hierarchy Flattening Algorithm
* **Purpose**: Transforms recursive parent-child tree structures (e.g., Cost Centre Hierarchies in `CSKS-KHINR`) into a flattened relational list.
* **Traversal Method**: Breadth-First Search (BFS) starting from the root node down to leaf nodes, generating nested path identifiers (`/ROOT/NODE_A/NODE_B`).

## 3. Fiscal-to-Calendar Period Mapping Logic
* **Period Conversion**: Maps SAP Fiscal Year Variant (`PERIV`) periods (e.g., special periods 13-16) to standard ISO 8601 calendar date ranges (`YYYY-MM-DD`).
* **Handling Adjustments**: Automatically adjusts period boundary offsets for non-calendar fiscal years to ensure accurate ledger balancing in FinSight.