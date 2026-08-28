// scripts/test-malformed-batch.js
// Automates TST-FLR-004: 10 malformed records in a batch of 100
// Expected: 90 succeed, 10 route to DLQ with correct error codes
const { validateJournalEntry } = require("./data-quality");
const { DeadLetterQueue } = require("./dlq");

function generateBatch(total = 100, malformedCount = 10) {
  const batch = [];
  for (let i = 0; i < total; i++) {
    const isMalformed = i < malformedCount;
    batch.push({
      documentId: isMalformed ? null : `MC01-2026-${5000000000 + i}`,
      postingDate: "2026-03-15",
      amountLC: isMalformed ? null : 1000 + i,
    });
  }
  return batch;
}

function runTest() {
  const batch = generateBatch(100, 10);
  const dlq = new DeadLetterQueue("dlq-gl-entries-test");
  let succeeded = 0;

  batch.forEach((entry) => {
    const result = validateJournalEntry(entry);
    if (result.valid) {
      succeeded++;
    } else {
      dlq.route(entry, result.errors[0].rule, result.errors[0].message);
    }
  });

  console.log(`\nSucceeded: ${succeeded}, DLQ routed: ${dlq.depth()}`);
  const pass = succeeded === 90 && dlq.depth() === 10;
  console.log(
    `TST-FLR-004: ${pass ? "PASS" : "FAIL"} (expected 90 succeed / 10 DLQ)`,
  );
}

runTest();