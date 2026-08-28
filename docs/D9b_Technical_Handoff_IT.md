# Technical Handoff Document
**Prepared for: Rajesh Venkataraman, VP of IT Infrastructure**

## Section 1: Changes to SAP Environment
- New RFC destination: `FDE9B_FINSIGHT_INT` (dedicated service user, not shared)
- New ODP subscriptions on: `I_JournalEntryItem`, `I_CostCentre`, `I_ProfitCentre`
  (12 CDS views total — full list in `api-specs/API_SAP_Source.yaml`)
- No custom Z-tables required; all extraction uses standard/released CDS views
- Transport requests will be raised per standard change process ahead of each
  deployment (tracked in Deployment Runbook, Deliverable 8)

## Section 2: Network and Firewall Requirements
- Integration platform (AWS Mumbai) → SAP Gateway: HTTPS/443, OData protocol
- Integration platform → FinSight API: HTTPS/443, outbound only
- No inbound connections required to SAP from the integration platform's network
- Existing MPLS/SD-WAN link between Pune DC and AWS Mumbai is sufficient;
  integration is capped at 25% of the 450Mbps link during business hours

## Section 3: Performance Impact Assessment
- ODP delta extraction limited to once per 30 minutes per provider (matches
  current SAP Basis restriction)
- RFC connection usage capped at 40 of the 50 available slots, leaving
  headroom for dialog users
- No extraction scheduled during nightly batch window (01:00-04:30 IST) or
  maintenance Saturdays
- Expected steady-state load: <5% additional CPU on SAP application servers
  based on projected transaction volumes (2.1M/month across all domains)

## Section 4: Security Requirements
- Service account requires authorization objects: `S_RFC` (for the specific
  function groups used), `S_TABU_DIS` (read-only, restricted to relevant tables)
- OAuth 2.0 client credentials used for FinSight-side auth; SAP-side auth via
  dedicated service user with RFC authorization, not a shared/generic account
- All secrets stored in a managed secrets vault, rotated every 90 days
- TLS 1.2+ enforced on all connections; AES-256 at rest for any staged data

## Section 5: Monitoring Integration
- Integration platform exposes Prometheus metrics; can be scraped by existing
  Nagios/Grafana infrastructure if IT wants a unified view
- Alert webhook available to route P1/P2 alerts into IT's existing PagerDuty
  or ticketing system on request

## Section 6: Support Handover
- L1 (initial triage): Integration team on-call rotation
- L2 (SAP-side issues): SAP Basis team (Priya's group) for RFC/ODP issues
- L3 (platform engineering): Zetheta platform team for FinSight-side issues
- Runbook and escalation contacts: see Deliverable 8

## Section 7: Maintenance Schedule
- Aligned to existing SAP maintenance windows (2nd/4th Saturday, 22:00-06:00 IST)
- FinSight maintenance: first Sunday of month, 02:00-06:00 IST
- Any deviation communicated 5 business days in advance via change management