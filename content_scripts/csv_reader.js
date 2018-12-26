function mainWork() {
  // Avoid injecting script more than once
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // Where eeeeverything happens
  // TODO: separate fn/file
  function convertCSV(separator, titleLine, skipLines) {
    removeResult();

    let tableContainer = document.createElement('div');
    tableContainer.className = 'csv-table';

    const html = document.body.innerHTML;
    const htmlNoTags = html.replace(/\<\/?[a-z]+\>/gi, '');

    const lineArray = htmlNoTags.split('\n');

    // TODO: if there is a title line, have option to transform data into array of objects, JSON style

    // TODO: detect separator, not hard coded or required from form!
    const arrayOfLineArrays = lineArray.map(line => {
      return line.split(separator === '' ? ',' : separator);
    });

    let result = '';

    if (skipLines > 0) {
      const skippedInfo = arrayOfLineArrays.splice(0, skipLines);
      // skipped text/info into its own div on top
      result += `<div class="text">${skippedInfo}</div>`;
    }

    // build the output table HTML chain manually here:
    // TODO: improve this to be more resilient
    result += '<table style="border: 5px solid #00f">';

    // TODO: find a better way without mutating the array
    if (titleLine) {
      const titleLine = arrayOfLineArrays.splice(0, 1);
      let row = '<thead><tr>';
      titleLine[0].forEach(item => (row += '<th>' + item + '</th>'));
      row += '</tr></thead><tbody>';
      result += row;
    }

    // TODO: if item looks like link, add <a> tag
    arrayOfLineArrays.forEach(array => {
      let row = '<tr>';
      array.forEach(item => (row += '<td>' + item + '</td>'));
      row += '</tr>';
      result += row;
    });

    result += '</tbody></table>';

    tableContainer.innerHTML = result;
    document.body.appendChild(tableContainer);
  }

  function removeResult() {
    const table = document.querySelector('.csv-table');

    if (table) {
      table.remove();
    }
  }

  browser.runtime.onMessage.addListener(message => {
    // const { command, separator, titleLine, skipLines } = message;
    const command = message.command;
    const separator = message.separator;
    const titleLine = message.titleLine;
    const skipLines = message.skipLines;

    if (command === 'convert') {
      convertCSV(separator, titleLine, skipLines);
    } else if (command === 'reset') {
      removeResult();
    }
  });
}

mainWork();
