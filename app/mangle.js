const whitelist = [
  // "Product Name",
  "Product ID",
  "Click Loans LVR & Rate ID",
  "Establishment Fee",
  "Legal Fees"
];
const blacklist = [];

function selectFromTo(data, from, to) {
  return data.slice(from, to);
}

function selectFirst10(data) {
  return selectFromTo(data, 0, 20);
}

function filterData(data) {
  return data.map(row => {
    if (whitelist.length + blacklist.length === 0) {
      return row;
    }

    const obj = {};

    Object.keys(row).forEach(key => {
      const isWhitelisted =
        whitelist.length === 0 || whitelist.indexOf(key) !== -1;
      const isBlacklisted = blacklist.indexOf(key) !== -1;

      if (isWhitelisted && !isBlacklisted) {
        obj[key] = row[key];
      }
    });

    return obj;
  });
}

function mangle(data) {
  return [/*selectFirst10, */ filterData].reduce((acc, fn) => fn(acc), data);
}

module.exports = mangle;
