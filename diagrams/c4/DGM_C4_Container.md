# C4 Level 2 — Container Diagram

```mermaid
C4Container
    title Container Diagram — Integration Platform Internals

    System_Boundary(sap, "Meridian Manufacturing") {
        System(sapSystem, "SAP S/4HANA", "Source ERP")
    }

    System_Boundary(platform, "Integration Platform") {
        Container(apiGateway, "API Gateway", "Node.js / Express", "Handles auth, rate limiting, routing")
        Container(scheduler, "Scheduler", "Cron / Node worker", "Triggers ODP delta extraction every 30 min")
        ContainerDb(kafka, "Kafka", "Message Broker", "Decouples extraction from loading; enables replay")
        Container(transformEngine, "Transformation Engine", "Node.js", "Maps SAP fields to FinSight schema")
        Container(reconService, "Reconciliation Service", "Node.js", "Verifies debit/credit balance and record counts")
        ContainerDb(dlq, "Dead Letter Queue", "Kafka topic", "Stores records that failed after retries")
        Container(monitoring, "Monitoring Stack", "Prometheus + Grafana", "Metrics, dashboards, alerting")
    }

    System_Ext(finsight, "Zetheta FinSight", "Destination analytics platform")

    Rel(scheduler, apiGateway, "Triggers extraction")
    Rel(apiGateway, sapSystem, "Pulls delta via ODP", "OData/HTTPS")
    Rel(apiGateway, kafka, "Publishes raw records")
    Rel(kafka, transformEngine, "Consumes raw records")
    Rel(transformEngine, kafka, "Publishes transformed records")
    Rel(transformEngine, dlq, "Routes failed records")
    Rel(kafka, apiGateway, "Consumed by loader for FinSight push")
    Rel(apiGateway, finsight, "Loads via REST", "HTTPS/OAuth2")
    Rel(reconService, sapSystem, "Reads source checksums")
    Rel(reconService, finsight, "Reads target checksums")
    Rel(monitoring, apiGateway, "Scrapes metrics")
    Rel(monitoring, kafka, "Monitors consumer lag")
```