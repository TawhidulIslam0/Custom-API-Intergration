// scripts/test-resilience.js
// Demonstrates retry+backoff, circuit breaker, and DLQ routing together
const {
  retryWithBackoff,
  classifyError,
  CircuitBreaker,
} = require("./resilience");
const { DeadLetterQueue } = require("./dlq");

const dlq = new DeadLetterQueue("dlq-gl-entries");
const breaker = new CircuitBreaker({
  failureThreshold: 3,
  openDurationMs: 5000,
});

// Simulates a flaky downstream call: fails first 2 times, succeeds 3rd
let callCount = 0;
async function flakyCall() {
  callCount++;
  if (callCount < 3) {
    const err = new Error("Service temporarily unavailable");
    err.response = { status: 503 };
    throw err;
  }
  return { status: "success", callCount };
}

async function runTest() {
  console.log(
    "--- Test 1: Retry with backoff (should succeed on 3rd attempt) ---",
  );
  try {
    const result = await breaker.call(() =>
      retryWithBackoff(flakyCall, { maxAttempts: 3, base: 200, cap: 2000 }),
    );
    console.log("Result:", result);
  } catch (err) {
    console.log("Failed after retries:", err.message);
  }

  console.log(
    "\n--- Test 2: Permanent error routes straight to DLQ (no retry) ---",
  );
  const badPayload = { documentId: "MC01-2026-9999999999" };
  try {
    await retryWithBackoff(
      () => {
        const err = new Error("Missing required field: postingDate");
        err.response = { status: 400 };
        throw err;
      },
      { maxAttempts: 3, base: 200 },
    );
  } catch (err) {
    dlq.route(badPayload, "ERR-MAP-001", err.message);
  }

  console.log(`\nFinal DLQ depth: ${dlq.depth()}`);
}

runTest();