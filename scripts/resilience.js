// scripts/resilience.js
// Implements exponential backoff with jitter + circuit breaker
// per Deliverable 4 specifications

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Exponential backoff with full jitter
// wait = min(cap, random(base, base * 2^attempt))
function calculateBackoff(attempt, base = 2000, cap = 60000) {
  const maxWait = Math.min(cap, base * Math.pow(2, attempt));
  return Math.random() * maxWait;
}

async function retryWithBackoff(
  fn,
  { maxAttempts = 3, base = 2000, cap = 60000 } = {},
) {
  let lastError;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isTransient = classifyError(err) === "TRANSIENT";
      if (!isTransient || attempt === maxAttempts - 1) {
        throw err;
      }
      const wait = calculateBackoff(attempt, base, cap);
      console.log(
        `  Retry ${attempt + 1}/${maxAttempts} after ${Math.round(wait)}ms (${err.message})`,
      );
      await sleep(wait);
    }
  }
  throw lastError;
}

function classifyError(err) {
  const status = err.response?.status;
  if (
    status === 429 ||
    status === 503 ||
    status === 500 ||
    err.code === "ECONNREFUSED"
  ) {
    return "TRANSIENT";
  }
  if (status === 400 || status === 422) return "DATA QUALITY";
  if (status === 401 || status === 403) return "PERMANENT";
  return "SYSTEM";
}

// Circuit breaker: CLOSED -> OPEN -> HALF_OPEN -> CLOSED
class CircuitBreaker {
  constructor({ failureThreshold = 5, openDurationMs = 30000 } = {}) {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.openDurationMs = openDurationMs;
    this.openedAt = null;
  }

  async call(fn) {
    if (this.state === "OPEN") {
      const elapsed = Date.now() - this.openedAt;
      if (elapsed < this.openDurationMs) {
        throw new Error(
          `Circuit breaker OPEN - failing fast (${Math.round((this.openDurationMs - elapsed) / 1000)}s remaining)`,
        );
      }
      this.state = "HALF_OPEN";
      console.log("  Circuit breaker: OPEN -> HALF_OPEN (probing)");
    }

    try {
      const result = await fn();
      if (this.state === "HALF_OPEN") {
        console.log("  Circuit breaker: HALF_OPEN -> CLOSED (probe succeeded)");
      }
      this.state = "CLOSED";
      this.failureCount = 0;
      return result;
    } catch (err) {
      this.failureCount++;
      if (
        this.state === "HALF_OPEN" ||
        this.failureCount >= this.failureThreshold
      ) {
        this.state = "OPEN";
        this.openedAt = Date.now();
        console.log(
          `  Circuit breaker: -> OPEN (${this.failureCount} failures)`,
        );
      }
      throw err;
    }
  }
}

module.exports = {
  retryWithBackoff,
  calculateBackoff,
  classifyError,
  CircuitBreaker,
};