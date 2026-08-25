// scripts/metrics.js
//
// Day 10 Monitoring Implementation
//
// Implements:
// - MON-002: Throughput
// - MON-003: P95 latency
// - MON-004: Error rate
// - Dashboard metric tracking
// - Standardized structured JSON logging
// - Day 10 monitoring/alerting metric names
//
// Lightweight in-memory implementation.
// Can later be adapted to Prometheus/Micrometer.

class MetricsCollector {
  constructor({ environment = "development" } = {}) {
    this.environment = environment;

    // Generic counters retained for backwards compatibility.
    this.counters = {};

    // Timing samples.
    this.timings = [];

    // Standard Day 10 monitoring metrics.
    this.metrics = {
      ingestionRequests: 0,
      pipelineDurationMs: [],
      errors: 0,

      dlqUnresolvedMessages: 0,

      dqRuleFailures: {},

      oauthTokenRefreshSuccess: 0,
      oauthTokenRefreshTotal: 0,

      destinationLatencyMs: [],

      batchOperations: 0,

      reconciliationMismatches: 0,

      // 0 = CLOSED
      // 1 = OPEN
      // 2 = HALF_OPEN
      circuitBreakerState: 0,

      // 1 = available
      // 0 = unavailable
      sapEndpointAvailability: 1,

      containerCpuPercent: 0,
      containerMemoryPercent: 0,

      databasePoolActive: 0,
      databasePoolTotal: 0,
    };
  }

  // ============================================================
  // Generic counter support
  // ============================================================

  increment(name, value = 1) {
    if (!Number.isFinite(value)) {
      throw new TypeError(
        "Metric increment value must be a finite number",
      );
    }

    this.counters[name] = (this.counters[name] || 0) + value;

    return this.counters[name];
  }

  getCounter(name) {
    return this.counters[name] || 0;
  }

  // ============================================================
  // Timing support
  // ============================================================

  recordTiming(operation, durationMs) {
    this.validateDuration(durationMs);

    const timing = {
      operation,
      durationMs,
      timestamp: Date.now(),
    };

    this.timings.push(timing);

    // Keep Day 10 pipeline metrics synchronized.
    this.metrics.pipelineDurationMs.push(durationMs);

    // A recorded timing represents one processed operation.
    this.recordIngestionRequest();

    return timing;
  }

  // ============================================================
  // MON-002: Throughput
  // ============================================================

  getThroughput() {
    if (this.timings.length === 0) {
      return "0.00";
    }

    const totalDurationMs = this.timings.reduce(
      (sum, timing) => sum + timing.durationMs,
      0,
    );

    if (totalDurationMs <= 0) {
      return this.timings.length.toFixed(2);
    }

    const totalDurationSeconds = totalDurationMs / 1000;

    return (
      this.timings.length / totalDurationSeconds
    ).toFixed(2);
  }

  // ============================================================
  // MON-003: P95 latency
  // ============================================================

  getP95Latency() {
    return this.calculateP95(
      this.timings.map((timing) => timing.durationMs),
    );
  }

  // ============================================================
  // MON-004: Error rate
  // ============================================================

  getErrorRate() {
    const total = this.metrics.ingestionRequests;
    const errors = this.metrics.errors;

    if (total === 0) {
      return "0.00";
    }

    return ((errors / total) * 100).toFixed(2);
  }

  // ============================================================
  // Day 10: Ingestion throughput
  // ============================================================

  recordIngestionRequest() {
    this.metrics.ingestionRequests++;

    this.increment(
      "finsight_ingestion_requests_total",
    );

    // Keep legacy request counter synchronized.
    this.increment("requests_total");

    return this.metrics.ingestionRequests;
  }

  // ============================================================
  // Day 10: Pipeline duration
  // ============================================================

  recordPipelineDuration(durationMs) {
    this.validateDuration(durationMs);

    this.metrics.pipelineDurationMs.push(durationMs);

    this.increment(
      "finsight_pipeline_duration_seconds_count",
    );

    return durationMs;
  }

  getPipelineP95Latency() {
    return this.calculateP95(
      this.metrics.pipelineDurationMs,
    );
  }

  // ============================================================
  // Day 10: Errors
  // ============================================================

  recordError(errorClass = "SYSTEM") {
    this.metrics.errors++;

    this.increment("finsight_errors_total");

    this.increment(
      `finsight_errors_total_${String(
        errorClass,
      ).toLowerCase()}`,
    );

    // Keep legacy error counter synchronized.
    this.increment("errors_total");

    return this.metrics.errors;
  }

  // ============================================================
  // Day 10: Circuit breaker
  //
  // 0 = CLOSED
  // 1 = OPEN
  // 2 = HALF_OPEN
  // ============================================================

  setCircuitBreakerState(state) {
    const normalizedState = String(state).toUpperCase();

    const stateMap = {
      CLOSED: 0,
      OPEN: 1,
      HALF_OPEN: 2,
    };

    if (!(normalizedState in stateMap)) {
      throw new Error(
        `Invalid circuit breaker state: ${state}. ` +
          "Expected CLOSED, OPEN, or HALF_OPEN.",
      );
    }

    this.metrics.circuitBreakerState =
      stateMap[normalizedState];

    this.increment(
      "finsight_circuit_breaker_state_changes_total",
    );

    return this.metrics.circuitBreakerState;
  }

  getCircuitBreakerState() {
    return this.metrics.circuitBreakerState;
  }

  // ============================================================
  // Day 10: DLQ
  // ============================================================

  setDLQBacklog(count) {
    if (!Number.isInteger(count) || count < 0) {
      throw new TypeError(
        "DLQ backlog must be a non-negative integer",
      );
    }

    this.metrics.dlqUnresolvedMessages = count;

    return count;
  }

  incrementDLQBacklog(value = 1) {
    if (!Number.isInteger(value)) {
      throw new TypeError(
        "DLQ increment must be an integer",
      );
    }

    const newValue =
      this.metrics.dlqUnresolvedMessages + value;

    if (newValue < 0) {
      throw new RangeError(
        "DLQ backlog cannot be negative",
      );
    }

    this.metrics.dlqUnresolvedMessages = newValue;

    this.increment(
      "finsight_dlq_unresolved_messages_count",
      value,
    );

    return this.metrics.dlqUnresolvedMessages;
  }

  getDLQBacklog() {
    return this.metrics.dlqUnresolvedMessages;
  }

  // ============================================================
  // Day 10: Data Quality failures
  // ============================================================

  recordDQFailure(ruleId) {
    if (!ruleId) {
      throw new Error("ruleId is required");
    }

    this.metrics.dqRuleFailures[ruleId] =
      (this.metrics.dqRuleFailures[ruleId] || 0) + 1;

    this.increment(
      "finsight_dq_rule_failures_total",
    );

    this.increment(
      `finsight_dq_rule_failures_total_${ruleId}`,
    );

    return this.metrics.dqRuleFailures[ruleId];
  }

  getDQFailures(ruleId) {
    if (ruleId) {
      return this.metrics.dqRuleFailures[ruleId] || 0;
    }

    return {
      ...this.metrics.dqRuleFailures,
    };
  }

  // ============================================================
  // Day 10: OAuth token refresh
  // ============================================================

  recordOAuthTokenRefresh(success) {
    this.metrics.oauthTokenRefreshTotal++;

    this.increment(
      "finsight_oauth_token_refreshes_total",
    );

    if (success) {
      this.metrics.oauthTokenRefreshSuccess++;

      this.increment(
        "finsight_oauth_token_refreshes_total_success",
      );
    } else {
      this.increment(
        "finsight_oauth_token_refreshes_total_failure",
      );
    }

    return this.getOAuthSuccessRate();
  }

  getOAuthSuccessRate() {
    const total =
      this.metrics.oauthTokenRefreshTotal;

    if (total === 0) {
      return "100.00";
    }

    return (
      (this.metrics.oauthTokenRefreshSuccess /
        total) *
      100
    ).toFixed(2);
  }

  // ============================================================
  // Day 10: FinSight destination latency
  // ============================================================

  recordDestinationLatency(durationMs) {
    this.validateDuration(durationMs);

    this.metrics.destinationLatencyMs.push(
      durationMs,
    );

    this.increment(
      "finsight_destination_requests_total",
    );

    return durationMs;
  }

  getDestinationP99Latency() {
    return this.calculatePercentile(
      this.metrics.destinationLatencyMs,
      0.99,
    );
  }

  // ============================================================
  // Day 10: Batch throughput
  // ============================================================

  recordBatchOperation() {
    this.metrics.batchOperations++;

    this.increment(
      "finsight_batch_operations_total",
    );

    return this.metrics.batchOperations;
  }

  // ============================================================
  // Day 10: Reconciliation
  // ============================================================

  recordReconciliationMismatch() {
    this.metrics.reconciliationMismatches++;

    this.increment(
      "finsight_reconciliation_mismatches_total",
    );

    return this.metrics.reconciliationMismatches;
  }

  setReconciliationMismatches(count) {
    if (!Number.isInteger(count) || count < 0) {
      throw new TypeError(
        "Reconciliation mismatch count must be a non-negative integer",
      );
    }

    this.metrics.reconciliationMismatches = count;

    return count;
  }

  // ============================================================
  // Day 10: SAP availability
  // ============================================================

  setSAPEndpointAvailability(available) {
    this.metrics.sapEndpointAvailability =
      available ? 1 : 0;

    return this.metrics.sapEndpointAvailability;
  }

  getSAPEndpointAvailability() {
    return this.metrics.sapEndpointAvailability;
  }

  // ============================================================
  // Day 10: Container resources
  // ============================================================

  setContainerResources(
    cpuPercent,
    memoryPercent,
  ) {
    this.validatePercentage(
      cpuPercent,
      "cpuPercent",
    );

    this.validatePercentage(
      memoryPercent,
      "memoryPercent",
    );

    this.metrics.containerCpuPercent =
      cpuPercent;

    this.metrics.containerMemoryPercent =
      memoryPercent;

    return {
      cpuPercent,
      memoryPercent,
    };
  }

  // ============================================================
  // Day 10: Database connection pool
  // ============================================================

  setDatabasePool(active, total) {
    if (
      !Number.isFinite(active) ||
      !Number.isFinite(total) ||
      active < 0 ||
      total < 0 ||
      active > total
    ) {
      throw new TypeError(
        "Database pool values must satisfy 0 <= active <= total",
      );
    }

    this.metrics.databasePoolActive = active;
    this.metrics.databasePoolTotal = total;

    return this.getDatabasePoolUtilization();
  }

  getDatabasePoolUtilization() {
    if (
      this.metrics.databasePoolTotal === 0
    ) {
      return "0.00";
    }

    return (
      (this.metrics.databasePoolActive /
        this.metrics.databasePoolTotal) *
      100
    ).toFixed(2);
  }

  // ============================================================
  // Day 10: Structured JSON logging
  //
  // Required fields:
  // timestamp
  // log_level
  // service_id
  // environment
  // correlation_id
  // transaction_id
  // event_type
  // source_endpoint
  // destination_endpoint
  // duration_ms
  // status_code
  // error_details
  // ============================================================

  logStructured({
    log_level = "INFO",
    service_id =
      "finsight-integration-engine",
    environment = this.environment,

    correlation_id = null,
    transaction_id = null,

    event_type = "SYSTEM_EVENT",

    source_endpoint = null,
    destination_endpoint = null,

    duration_ms = 0,
    status_code = 200,

    error_details = null,

    // Backwards-compatible aliases.
    level,
    service,
    correlationId,
    batchId,
    operation,
    durationMs,
    status,
    errorCode,
  } = {}) {
    const resolvedLevel =
      level || log_level;

    const resolvedService =
      service || service_id;

    const resolvedCorrelationId =
      correlationId || correlation_id;

    const resolvedTransactionId =
      transaction_id || batchId || null;

    const resolvedEventType =
      operation || event_type;

    const resolvedDuration =
      durationMs !== undefined
        ? durationMs
        : duration_ms;

    const resolvedStatus =
      status !== undefined
        ? status
        : status_code;

    let resolvedErrorDetails =
      error_details;

    if (!resolvedErrorDetails && errorCode) {
      resolvedErrorDetails = {
        code: errorCode,
        message: null,
        stack_trace: null,
      };
    }

    const entry = {
      timestamp:
        new Date().toISOString(),

      log_level: resolvedLevel,

      service_id: resolvedService,

      environment,

      correlation_id:
        resolvedCorrelationId,

      transaction_id:
        resolvedTransactionId,

      event_type:
        resolvedEventType,

      source_endpoint,

      destination_endpoint,

      duration_ms:
        resolvedDuration,

      status_code:
        resolvedStatus,

      error_details:
        resolvedLevel === "ERROR" ||
        resolvedLevel === "FATAL"
          ? resolvedErrorDetails
          : null,
    };

    console.log(
      JSON.stringify(entry),
    );

    return entry;
  }

  // ============================================================
  // Day 10: Monitoring snapshot
  // ============================================================

  getMetricsSnapshot() {
    return {
      finsight_ingestion_requests_total:
        this.metrics.ingestionRequests,

      finsight_pipeline_duration_seconds_p95:
        this.getPipelineP95Latency() / 1000,

      finsight_errors_total:
        this.metrics.errors,

      finsight_error_rate_percent:
        Number(this.getErrorRate()),

      finsight_circuit_breaker_state:
        this.metrics.circuitBreakerState,

      finsight_dlq_unresolved_messages_count:
        this.metrics.dlqUnresolvedMessages,

      finsight_dq_rule_failures_total:
        Object.values(
          this.metrics.dqRuleFailures,
        ).reduce(
          (sum, count) => sum + count,
          0,
        ),

      finsight_oauth_token_refresh_success_rate:
        Number(this.getOAuthSuccessRate()),

      finsight_destination_latency_p99_ms:
        this.getDestinationP99Latency(),

      finsight_reconciliation_mismatches:
        this.metrics.reconciliationMismatches,

      finsight_sap_endpoint_available:
        this.metrics.sapEndpointAvailability,

      container_cpu_percent:
        this.metrics.containerCpuPercent,

      container_memory_percent:
        this.metrics.containerMemoryPercent,

      database_pool_utilization_percent:
        Number(
          this.getDatabasePoolUtilization(),
        ),
    };
  }

  // ============================================================
  // Percentile calculations
  // ============================================================

  calculatePercentile(
    values,
    percentile,
  ) {
    if (
      !Array.isArray(values) ||
      values.length === 0
    ) {
      return 0;
    }

    const sorted = [...values].sort(
      (a, b) => a - b,
    );

    const rank = Math.ceil(
      sorted.length * percentile,
    );

    const index = Math.max(
      0,
      Math.min(
        rank - 1,
        sorted.length - 1,
      ),
    );

    return sorted[index];
  }

  calculateP95(values) {
    return this.calculatePercentile(
      values,
      0.95,
    );
  }

  // ============================================================
  // Validation helpers
  // ============================================================

  validateDuration(durationMs) {
    if (
      !Number.isFinite(durationMs) ||
      durationMs < 0
    ) {
      throw new TypeError(
        "durationMs must be a non-negative number",
      );
    }
  }

  validatePercentage(
    value,
    fieldName,
  ) {
    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new TypeError(
        `${fieldName} must be between 0 and 100`,
      );
    }
  }
}

module.exports = {
  MetricsCollector,
};