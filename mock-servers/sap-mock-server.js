const express = require("express");
const app = express();
const PORT = 4001;

// Sample GL journal entry data, shaped like real ACDOCA fields
function generateGLEntries(count = 10) {
  const entries = [];
  const companyCodes = ["MC01", "MC02", "MC03"];
  const costCentres = ["1000100", "1000200", "1000300"];

  for (let i = 0; i < count; i++) {
    entries.push({
      RCLNT: "100",
      RLDNR: "0L",
      RBUKRS: companyCodes[i % companyCodes.length],
      GJAHR: "2026",
      BELNR: String(5000000000 + i),
      BUZEI: "001",
      RACCT: "0000400000",
      HSL: (Math.random() * 100000).toFixed(2), // amount local currency
      RHCUR: "INR",
      PRCTR: "10001000",
      KOSTL: costCentres[i % costCentres.length],
      BUDAT: "20260315", // posting date, SAP internal format YYYYMMDD
      BLDAT: "20260314", // document date
      MONAT: "12", // fiscal period
      DRCRK: i % 2 === 0 ? "S" : "H", // Debit/Credit indicator
    });
  }
  return entries;
}

// Simulates the ODP delta extraction endpoint
app.get(
  "/sap/opu/odata/sap/API_JOURNALENTRYITEM_SRV/JournalEntryItems",
  (req, res) => {
    const deltaToken = req.query.delta_token || null;
    res.json({
      d: {
        results: generateGLEntries(10),
        deltaToken: `${Date.now()}_000001`,
      },
    });
  },
);

app.listen(PORT, () => {
  console.log(`Mock SAP server running at http://localhost:${PORT}`);
});