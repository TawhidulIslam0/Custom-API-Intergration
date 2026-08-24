# Rollback Procedure & Decision Matrix

## Overview
This document defines the rollback strategy, trigger conditions, decision authority, and execution steps to safely revert the integration platform to the previous stable release version in the event of a critical deployment failure.

## Rollback Decision Matrix
| Trigger Condition | Severity | Decision Authority | Max Decision Time | Action Plan |
| :--- | :--- | :--- | :--- | :--- |
| **Data Corruption / Mass Variance** | Critical (P1) | Lead Architect / Head of Eng | 10 minutes | Immediate traffic halt, restore DB from pre-deploy snapshot, revert Helm chart. |
| **Persistent CrashLoopBackOff (>50% pods)**| High (P2) | DevOps Lead | 15 minutes | Execute `helm rollback` to previous stable revision. |
| **Critical Upstream SAP API Failure** | High (P2) | Integration Lead | 20 minutes | Trip circuit breaker, isolate extraction queues, investigate SAP gateway. |
| **OAuth / Security Auth Failure** | Critical (P1) | Security Lead | 10 minutes | Revert secret configurations or rollback auth microservice deployment. |

## Step-by-Step Rollback Execution
1. **Step 1: Halt Incoming Extractions (Duration: 2 mins)**
   * **Command**: `kubectl patch cronjob sap-odp-extractor -p '{"spec":{"suspend":true}}' -n finsight-prod`
2. **Step 2: Rollback Helm Deployment (Duration: 5 mins)**
   * **Command**: `helm rollback finsight-integration 0 --namespace finsight-prod`
3. **Step 3: Restore Database State (If Applicable) (Duration: 15 mins)**
   * **Command**: `aws rds restore-db-instance-from-db-snapshot --db-instance-identifier finsight-prod-db --db-snapshot-identifier finsight-prod-predeploy-snap`
4. **Step 4: Verify System Recovery (Duration: 10 mins)**
   * **Command**: `npm run test:smoke -- --env=production`