# Error Notification Matrix

| Error Class | Notification Channel | SLA / Response Time | Escalation Path |
| :--- | :--- | :--- | :--- |
| **TRANSIENT** | Slack Alert / Warning Log | Automated retry handles; alert if retry exhausts (>3 attempts) | On-call engineer |
| **PERMANENT** | PagerDuty / Email Alert | Immediate (SLA: 15 mins) | Integration Support Lead |
| **DATA QUALITY** | Dashboard Counter / DLQ Log | Batch review (SLA: 24 hours) | Data Steward / Operations |
| **SYSTEM** | PagerDuty Critical Page | Immediate (SLA: 5 mins) | Infrastructure On-Call & DevOps |