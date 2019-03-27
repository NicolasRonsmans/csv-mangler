const fs = require("fs");
const path = require("path");
const express = require("express");
const createHTML = require("create-html");
const PORT = 8080;

function dataToString(data) {
  const headers = Object.keys(data[0]);

  let str = `
    <table>
      <thead>
        <tr>
          ${headers
            .map(
              key => `
            <th>${key}</th>
          `
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(row => {
    str += `
      <tr>
      ${headers
        .map(
          key => `
        <td>${row[key]}</td>
      `
        )
        .join("")}
      </tr>
    `;
  });

  str += `
      </tbody>
    </table>
  `;

  return str;
}

module.exports = function(data) {
  const html = createHTML({
    title: "CSV Mangler",
    head: `
      <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
      <link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css">
      <link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css">
      <style>
        body {
          padding: 20px;
        }
      </style>
    `,
    body: dataToString(data)
  });

  new Promise(resolve => {
    fs.writeFile("./index.html", html, err => {
      if (err) {
        console.log(err);
      }

      resolve();
    });
  }).then(() => {
    const app = express();

    app.get("/", (req, res) => {
      return res.sendFile(path.join(__dirname, "./index.html"));
    });

    app.listen(PORT);

    console.log(`Server spinned up: http://localhost:${PORT}`);
  });
};
