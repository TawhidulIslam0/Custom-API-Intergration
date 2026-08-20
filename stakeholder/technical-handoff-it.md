# Technical Handoff Document for Client IT

## Overview
This document provides Client IT and infrastructure operations with the operational details necessary to support, monitor, and maintain the integration pipeline.

## SAP S/4HANA Changes & Configuration
* **ODP Extraction Queues**: Requires activation and monitoring of Operational Data Provisioning (ODP) extractors for Finance and Controlling.
* **RFC / HTTP Destinations**: Configured secure RFC destinations and HTTP outbound connections for webhook callbacks and API polling.
* **Service User Profiles**: Dedicated system user (`RFC_FARSIGHT`) provisioned with minimal required read permissions.

## Network & Firewall Requirements
* **Whitelist Entries**: Corporate firewall configured to allow TLS traffic over port 443 from Kubernetes worker nodes to SAP S/4HANA API gateways.
* **Internal Segmentation**: Calico network policies enforce strict namespace isolation (`finsight-prod`, `finsight-kafka`).

## Performance Impact & Throttling
* **SAP Load Management**: ODP delta extraction scheduled during off-peak and streaming intervals to limit CPU utilization impact on SAP S/4HANA (< 5% overhead).
* **Rate Limiting**: Configured API client throttling to respect SAP Gateway limits.

## Support Handover & Authorisation Objects
* **Authorization Objects**: Required SAP roles include `S_TABU_DIS`, `S_RFC`, and specific ODP monitoring authorizations.
* **Runbook Integration**: Level 1 and Level 2 support teams onboarded with PagerDuty alerts and escalation matrices.