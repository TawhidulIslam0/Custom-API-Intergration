// scripts/test-fiscal-mapping.js
// Automates TST-FNC-005: Fiscal Period Mapping
// Periods 001-012 map directly; 013-016 map to 012 with specialPeriod flag

function mapFiscalPeriod(sapPeriod) {
  const period = parseInt(sapPeriod, 10);
  if (period >= 1 && period <= 12) {
    return { fiscalPeriod: sapPeriod.padStart(3, "0"), specialPeriod: false };
  }
  if (period >= 13 && period <= 16) {
    return { fiscalPeriod: "012", specialPeriod: true };
  }
  throw new Error(`Invalid fiscal period: ${sapPeriod}`);
}

function runTest() {
  const testCases = [
    { input: "001", expectedPeriod: "001", expectedSpecial: false },
    { input: "012", expectedPeriod: "012", expectedSpecial: false },
    { input: "013", expectedPeriod: "012", expectedSpecial: true },
    { input: "016", expectedPeriod: "012", expectedSpecial: true },
  ];

  let passed = 0;
  testCases.forEach(({ input, expectedPeriod, expectedSpecial }) => {
    const result = mapFiscalPeriod(input);
    const ok =
      result.fiscalPeriod === expectedPeriod &&
      result.specialPeriod === expectedSpecial;
    console.log(
      `  Period ${input} -> ${JSON.stringify(result)} ... ${ok ? "PASS" : "FAIL"}`,
    );
    if (ok) passed++;
  });

  console.log(`\nTST-FNC-005: ${passed}/${testCases.length} assertions passed`);
}

runTest();
module.exports = { mapFiscalPeriod };