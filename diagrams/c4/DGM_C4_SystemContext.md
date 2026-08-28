# C4 Level 1 — System Context Diagram

```mermaid
C4Context
    title System Context — SAP to FinSight Integration (Meridian Manufacturing)

    Person(cfo, "CFO", "Ananya Krishnan — needs real-time financial KPIs")
    Person(itAdmin, "SAP Basis Admin", "Priya Deshmukh — protects SAP system health")
    Person(auditor, "Internal Auditor", "Dr. Sanjay Kulkarni — needs audit trail")

    System_Boundary(client, "Meridian Manufacturing") {
        System(sap, "SAP S/4HANA", "Core ERP — financial, procurement, and manufacturing data across 7 plants")
    }

    System(integration, "Integration Platform", "Extracts, transforms, and loads financial data from SAP to FinSight")

    System_Ext(finsight, "Zetheta FinSight", "Financial analytics and reporting platform")

    Rel(sap, integration, "Exposes GL/AP/AR/CC data via", "OData / CDS Views / ODP")
    Rel(integration, finsight, "Loads transformed journal entries via", "REST API / OAuth 2.0")
    Rel(cfo, finsight, "Views dashboards")
    Rel(itAdmin, sap, "Monitors RFC pool, batch windows")
    Rel(auditor, integration, "Reviews reconciliation reports")

    UpdateRelStyle(sap, integration, $textColor="white", $lineColor="grey")
    UpdateRelStyle(integration, finsight, $textColor="white", $lineColor="grey")
```