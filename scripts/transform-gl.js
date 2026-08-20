function ltrim(str, char) {
  let i = 0;
  while (i < str.length && str[i] === char) i++;
  return str.slice(i);
}

function formatSapDate(sapDate) {
  // SAP internal format YYYYMMDD -> ISO YYYY-MM-DD
  return `${sapDate.slice(0, 4)}-${sapDate.slice(4, 6)}-${sapDate.slice(6, 8)}`;
}

function transformGLEntry(sapEntry) {
  // MAP-GL-001: documentId = company code + fiscal year + trimmed doc number
  const documentId = `${sapEntry.RBUKRS}-${sapEntry.GJAHR}-${ltrim(sapEntry.BELNR, "0")}`;

  // MAP-GL-002/003: date formatting
  const postingDate = formatSapDate(sapEntry.BUDAT);
  const documentDate = formatSapDate(sapEntry.BLDAT);

  // MAP-GL-004: GL account, strip leading zeros
  const glAccount = ltrim(sapEntry.RACCT, "0");

  // MAP-GL-005/006: amounts as decimals
  const amountLC = parseFloat(sapEntry.HSL);

  // MAP-GL-009/010: cost centre / profit centre
  const costCentre = ltrim(sapEntry.KOSTL, "0");
  const profitCentre = ltrim(sapEntry.PRCTR, "0");

  return {
    documentId,
    postingDate,
    documentDate,
    glAccount,
    amountLC,
    localCurrency: sapEntry.RHCUR,
    costCentre,
    profitCentre,
    type: sapEntry.DRCRK === "S" ? "DEBIT" : "CREDIT",
  };
}

module.exports = { transformGLEntry, ltrim, formatSapDate };