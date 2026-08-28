# C4 Level 3 — Component Diagram (Transformation Engine)

```mermaid
C4Component
    title Component Diagram — Transformation Engine

    Container_Boundary(engine, "Transformation Engine") {
        Component(extractor, "Extractor", "Node module", "Pulls raw records from Kafka topic")
        Component(mapper, "Field Mapper", "Node module", "Applies MAP-GL-001 through MAP-GL-012 rules")
        Component(validator, "Validator", "Node module", "Checks NOT NULL, ranges, referential integrity")
        Component(enricher, "Enricher", "Node module", "Looks up cost centre / profit centre master data")
        Component(errorRouter, "Error Router", "Node module", "Routes bad records to DLQ with error code")
        Component(loader, "Loader", "Node module", "Publishes clean records to output topic")
    }

    ContainerDb(kafkaIn, "Kafka: raw-gl-entries", "Topic")
    ContainerDb(kafkaOut, "Kafka: transformed-gl-entries", "Topic")
    ContainerDb(dlq, "Kafka: dlq-gl-entries", "Topic")
    ContainerDb(masterData, "Master Data Cache", "Redis")

    Rel(kafkaIn, extractor, "Consumes")
    Rel(extractor, mapper, "Passes raw record")
    Rel(mapper, enricher, "Passes mapped record")
    Rel(enricher, masterData, "Looks up CC/PC names")
    Rel(enricher, validator, "Passes enriched record")
    Rel(validator, loader, "Valid record")
    Rel(validator, errorRouter, "Invalid record")
    Rel(errorRouter, dlq, "Publishes with error code")
    Rel(loader, kafkaOut, "Publishes")
```