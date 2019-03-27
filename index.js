const fs = require("fs");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
const server = require("./server");
const INPUT_FILE = "./input.csv";
const OUTPUT_FILE = "./output.csv";
const rows = [];

function mangleData(data) {
  return data.filter(row => {
    return Object.keys(row).filter(key => row[key] === "").length > 2;
  });
}

new Promise(resolve => {
  fs.createReadStream(INPUT_FILE)
    .pipe(csvParser())
    .on("data", row => rows.push(row))
    .on("end", () => resolve(rows));
})
  .then(mangleData)
  .then(data => {
    const ws = fs.createWriteStream(OUTPUT_FILE);

    fastCsv.write(data, { headers: true }).pipe(ws);

    server(data);
  });
