# Step-by-Step Deployment Guide

## Overview
This document outlines the sequential, numbered deployment procedure for rolling out the integration platform to production, complete with estimated durations and execution commands.

## Deployment Steps
1. **Step 1: Verify Pre-Deployment Sign-offs (Duration: 15 mins)**
   * **Action**: Confirm all items on the pre-deployment checklist are checked and CAB approval is logged.
   * **Command**: `kubectl get configmap deployment-approval -n finsight-prod`

2. **Step 2: Take Pre-Deployment Database Snapshots (Duration: 20 mins)**
   * **Action**: Execute manual snapshots of production PostgreSQL databases and Redis state stores.
   * **Command**: `aws rds create-db-snapshot --db-instance-identifier finsight-prod-db --db-snapshot-identifier finsight-prod-predeploy-snap`

3. **Step 3: Apply Database Migrations (Duration: 10 mins)**
   * **Action**: Run Flyway/Alembic migration scripts against the primary production database.
   * **Command**: `kubectl apply -f k8s/migrations/prod-migration-job.yaml`

4. **Step 4: Deploy Kafka Topic Configurations & Schema Registry (Duration: 10 mins)**
   * **Action**: Provision Kafka topics, retention policies, and update Schema Registry definitions.
   * **Command**: `kubectl apply -f k8s/kafka/topics-prod.yaml`

5. **Step 5: Deploy Microservice Workloads via Helm (Duration: 25 mins)**
   * **Action**: Perform rolling deployment of ODP extraction service, transform engine, and destination sync workers.
   * **Command**: `helm upgrade --install finsight-integration ./helm/finsight-integration --namespace finsight-prod --values ./helm/values-prod.yaml`

6. **Step 6: Verify Pod Health and Readiness Probes (Duration: 10 mins)**
   * **Action**: Ensure all Kubernetes pods transition to Running and Ready status without restart loops.
   * **Command**: `kubectl get pods -n finsight-prod --watch`

7. **Step 7: Execute Smoke Tests & Integration Verification (Duration: 15 mins)**
   * **Action**: Run targeted automated integration smoke tests against staging-to-prod canary feeds.
   * **Command**: `npm run test:smoke -- --env=production`

8. **Step 8: Switch Traffic & Enable Active ODP Extraction Schedulers (Duration: 10 mins)**
   * **Action**: Unpause scheduled cron jobs for SAP S/4HANA ODP delta extraction and FinSight synchronization.
   * **Command**: `kubectl patch cronjob sap-odp-extractor -p '{"spec":{"suspend":false}}' -n finsight-prod`