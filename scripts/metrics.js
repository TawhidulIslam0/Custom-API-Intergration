// scripts/metrics.js
// Lightweight in-memory metrics collector demonstrating MON-002 and MON-004

class MetricsCollector {
  constructor() {
    this.counters = {};
    this.timings = [];
  }

  increment(name, value = 1) {
    this.counters[name] = (this.counters[name] || 0) + value;
  }

  recordTiming(operation, durationMs) {
    this.timings.push({ operation, durationMs, timestamp: Date.now() });
  }

  // MON-002: Throughput
  getThroughput(windowSeconds = 60) {
    const cutoff = Date.now() - windowSeconds * 1000;
    const recentCount = this.timings.filter(
      (t) => t.timestamp >= cutoff,
    ).length;
    return (recentCount / windowSeconds).toFixed(2);
  }

  // MON-003: P95 latency
  getP95Latency() {
    if (this.timings.length === 0) return 0;
    const sorted = [...this.timings].sort(
      (a, b) => a.durationMs - b.durationMs,
    );
    const idx = Math.floor(sorted.length * 0.95);
    return sorted[idx]?.durationMs || sorted[sorted.length - 1].durationMs;
  }

  // MON-004: Error rate
  getErrorRate() {
    const total = this.counters["requests_total"] || 0;
    const errors = this.counters["errors_total"] || 0;
    return total === 0 ? 0 : ((errors / total) * 100).toFixed(2);
  }

  // Structured JSON log line per the D6 logging standard
  logStructured({
    level,
    service,
    correlationId,
    batchId,
    domain,
    operation,
    durationMs,
    status,
    errorCode,
    recordCount,
  }) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service,
      correlationId,
      batchId,
      domain,
      operation,
      durationMs,
      status,
      errorCode: errorCode || null,
      recordCount,
      environment: "development",
    };
    console.log(JSON.stringify(entry));
    return entry;
  }
}

module.exports = { MetricsCollector };