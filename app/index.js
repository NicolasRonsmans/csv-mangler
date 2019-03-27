const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
const createHTML = require("create-html");
const mangleData = require("./mangle");

const CLIENT = path.join(__dirname, "../client/");
const INPUT_FILE = path.join(__dirname, "../data/input.csv");
const OUTPUT_FILE = path.join(__dirname, "../data/output.csv");
const rows = [];

function readCsv() {
  return new Promise(resolve => {
    fs.createReadStream(INPUT_FILE)
      .pipe(csvParser())
      .on("data", row => rows.push(row))
      .on("end", () => resolve(rows));
  });
}

function writeCsv(data) {
  // const ws = fs.createWriteStream(OUTPUT_FILE);

  // fastCsv.write(data, { headers: true }).pipe(ws);

  return data;
}

function writeHtml(data) {
  const html = createHTML({
    title: "CSV Mangler",
    head: `
        <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
        <link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css">
        <link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css">
        <style>
        </style>
        <link rel="stylesheet" href="./styles.css" />
      `,
    body: `
        <script>
          const jsonStr = '${JSON.stringify(data)}';
        </script>
        <script src="./script.js"></script>
      `
  });

  fs.writeFile(path.join(CLIENT, "index.html"), html, err => {
    if (err) {
      console.log(err);
    }
  });
}

readCsv()
  .then(mangleData)
  .then(writeCsv)
  .then(writeHtml);
