const container = document.createElement("div");
const data = JSON.parse(jsonStr);

function buildTable(data) {
  const headers = Object.keys(data[0]);

  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
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
        ${buildTBody(data)}
      </tbody>
    </table>
  `;
}

function buildTBody(data) {
  return data
    .map((row, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          ${Object.keys(row)
            .map(
              key => `
                <td>${row[key]}</td>
              `
            )
            .join("")}
        </tr>
      `;
    })
    .join("");
}

container.innerHTML = buildTable(data);
document.body.appendChild(container);
