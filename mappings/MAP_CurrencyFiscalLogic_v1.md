# Currency Conversion & Fiscal Period Mapping Logic

## 1. Currency Conversion
* **Method**: Use daily spot rate from SAP `TCURR` table.
* **Logic**: `TargetAmount = SourceAmount * ExchangeRate`
* **Rounding**: Round to 2 decimal places using HALF_UP.

## 2. Fiscal Period Mapping
* **Mapping**: SAP `PERIV` (Fiscal Year Variant) to FinSight `AccountingPeriod`.
* **Logic**: Convert standard YYYYMM format to ISO 8601 YYYY-MM-DD (start/end dates).