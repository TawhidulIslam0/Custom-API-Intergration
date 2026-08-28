// scripts/test-metrics.js
const { MetricsCollector } = require("./metrics");

const metrics = new MetricsCollector();

// Simulate a batch of operations with varying latency
const simulatedDurations = [12, 45, 23, 89, 15, 200, 34, 18, 500, 27];

simulatedDurations.forEach((duration, i) => {
  const success = duration < 300;
  metrics.increment("requests_total");
  if (!success) metrics.increment("errors_total");
  metrics.recordTiming("transform", duration);

  metrics.logStructured({
    level: success ? "INFO" : "ERROR",
    service: "transformation-engine",
    correlationId: `MC01-2026-500000000${i}`,
    batchId: "BATCH-GL-TEST-001",
    domain: "general-ledger",
    operation: "transform",
    durationMs: duration,
    status: success ? "success" : "timeout",
    errorCode: success ? null : "ERR-EXT-001",
    recordCount: 1,
  });
});

console.log("\n--- Dashboard Summary ---");
console.log("MON-002 Throughput (records/sec):", metrics.getThroughput());
console.log("MON-003 P95 Latency (ms):", metrics.getP95Latency());
console.log("MON-004 Error Rate (%):", metrics.getErrorRate());