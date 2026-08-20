// scripts/transform-ap.js
// Implements MAP-AP-001 through MAP-AP-008

function ltrim(str, char) {
  let i = 0;
  while (i < str.length && str[i] === char) i++;
  return str.slice(i);
}

function calculateAgeingBucket(postingDateStr) {
  const posting = new Date(
    `${postingDateStr.slice(0, 4)}-${postingDateStr.slice(4, 6)}-${postingDateStr.slice(6, 8)}`,
  );
  const days = Math.floor((Date.now() - posting) / (1000 * 60 * 60 * 24));
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "90+";
}

function transformAPItem(sapItem, vendorMaster) {
  const vendorId = ltrim(sapItem.LIFNR, "0");
  const vendor = vendorMaster[vendorId] || {};

  return {
    vendorId,
    companyCode: sapItem.BUKRS,
    amount: parseFloat(sapItem.DMBTR),
    clearingDate: sapItem.AUGDT || null,
    ageingBucket: calculateAgeingBucket(sapItem.BUDAT),
    vendorName: vendor.NAME1 || null,
    vendorGSTIN: vendor.STCD1 || null,
    assignmentReference: sapItem.ZUONR || null,
  };
}

module.exports = { transformAPItem, calculateAgeingBucket };