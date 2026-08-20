// scripts/dlq.js
// In-memory Dead Letter Queue simulation with alert threshold

class DeadLetterQueue {
  constructor(topicName, alertThreshold = 500) {
    this.topicName = topicName;
    this.alertThreshold = alertThreshold;
    this.messages = [];
  }

  route(payload, errorCode, errorMessage) {
    const entry = {
      payload,
      errorCode,
      errorMessage,
      timestamp: new Date().toISOString(),
      correlationId: payload.documentId || "unknown",
    };
    this.messages.push(entry);
    console.log(
      `  -> Routed to DLQ [${this.topicName}]: ${errorCode} (${entry.correlationId})`,
    );

    if (this.messages.length >= this.alertThreshold) {
      console.log(
        `  ALERT (P2): DLQ depth ${this.messages.length} exceeds threshold ${this.alertThreshold}`,
      );
    }
    return entry;
  }

  depth() {
    return this.messages.length;
  }
}

module.exports = { DeadLetterQueue };