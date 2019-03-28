const GROUP_BY = ["Product Name", "Product ID"];
const container = document.createElement("div");
const data = JSON.parse(jsonStr);

function buildTable(data) {
  return `
    <table>
      <colgroup>
        <col style="width: 20px;">
      </colgroup>
      ${buildTHead(data)}
      ${buildTBody(data)}
    </table>
  `;
}

function removeGroupHead(row) {
  if (GROUP_BY.length === 0) {
    return row;
  }

  const obj = {};

  Object.keys(row).forEach(key => {
    if (GROUP_BY.indexOf(key) === -1) {
      obj[key] = "";
    }
  });

  return obj;
}

function buildTHead(data) {
  const row = removeGroupHead(data[0]);
  const headers = Object.keys(data[0]);

  return `
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
  `;
}

function addGroupHead(data) {
  if (GROUP_BY.length === 0) {
    return data;
  }

  const rows = [];
  let prevGroupId = null;

  data.forEach(row => {
    const groupId = GROUP_BY.filter(key => row[key] !== undefined)
      .map(key => row[key])
      .join(" ");
    const groupName = GROUP_BY.filter(key => row[key] !== undefined)
      .map(key => {
        return `${key}: ${row[key]}`;
      })
      .join(" ");

    if (prevGroupId === null || prevGroupId !== groupId) {
      prevGroupId = groupId;
      rows.push({
        isGroup: true,
        groupName
      });
    }

    rows.push(row);
  });

  return rows.map(row => {
    if (row.isGroup) {
      return row;
    }

    const obj = {};

    Object.keys(row).filter(key => {
      if (GROUP_BY.indexOf(key) === -1) {
        obj[key] = row[key];
      }
    });

    return obj;
  });
}

function buildTBody(data) {
  const colspan = Object.keys(data[0]).length;
  const rows = addGroupHead(data);
  let groupIndex = 0;
  let entryIndex = 0;

  return `
    <tbody>
      ${rows
        .map(row => {
          if (row.isGroup) {
            return `
              <tr>
                <th></th>
                <th>
                  ${++groupIndex}.
                  ${row.groupName}
                </th>
                <th colspan="${colspan - 1}"></th>
              </tr>
            `;
          }

          return `
            <tr>
              <td>${++entryIndex}</td>
              <td></td>
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
        .join("")}
    </tbody>
  `;
}

container.innerHTML = buildTable(data);
document.body.appendChild(container);
