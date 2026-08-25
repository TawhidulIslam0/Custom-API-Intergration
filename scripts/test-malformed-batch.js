// scripts/test-malformed-batch.js
//
// Automates TST-FLR-004:
// 10 malformed records in a batch of 100.
//
// Expected:
// - 90 records succeed
// - 10 records route to DLQ
// - Malformed records contain missing required DQ fields

const { validateJournalEntry } = require("./data-quality");
const { DeadLetterQueue } = require("./dlq");

function generateBatch(total = 100, malformedCount = 10) {
  const batch = [];

  for (let i = 0; i < total; i++) {
    const isMalformed = i < malformedCount;

    batch.push({
      // Required DQ fields
      company_code: isMalformed ? null : "MC01",
      fiscal_year: isMalformed ? null : 2026,
      document_number: isMalformed
        ? null
        : `MC01-2026-${5000000000 + i}`,
      posting_date: isMalformed ? null : "2026-03-15",
      currency_key: isMalformed ? null : "USD",

      // Backwards-compatible fields used by existing integration logic
      documentId: isMalformed
        ? null
        : `MC01-2026-${5000000000 + i}`,
      postingDate: isMalformed ? null : "2026-03-15",
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
      dlq.route(
        entry,
        result.errors[0].rule,
        result.errors[0].message,
      );
    }
  });

  const dlqCount = dlq.depth();

  console.log(`\nSucceeded: ${succeeded}, DLQ routed: ${dlqCount}`);

  const pass = succeeded === 90 && dlqCount === 10;

  console.log(
    `TST-FLR-004: ${pass ? "PASS" : "FAIL"} ` +
      `(expected 90 succeed / 10 DLQ)`,
  );

  return pass;
}

runTest();