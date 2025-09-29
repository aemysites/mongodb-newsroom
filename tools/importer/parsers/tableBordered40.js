/* global WebImporter */
export default function parse(element, { document }) {
  // Find the desktop table (the one with two columns)
  const desktopTable = element.querySelector('table.hide-lt-800');
  let tableToUse = desktopTable;
  if (!tableToUse) {
    tableToUse = element.querySelector('table');
  }

  // Fallback: If no desktop table, check for all tables (to cover mobile tables)
  let tables = [];
  if (desktopTable) {
    tables = [desktopTable];
  } else {
    tables = Array.from(element.querySelectorAll('table'));
  }

  // Extract all rows from all tables
  let headerCells = [];
  let dataRows = [];
  tables.forEach((table, idx) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        const ths = Array.from(headerRow.children).map(th => th.textContent.trim());
        // Only add header row from the first table
        if (idx === 0) headerCells = ths;
      }
    }
    if (tbody) {
      Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
        const tds = Array.from(tr.children).map(td => td.textContent.trim());
        // Only push non-empty rows
        if (tds.some(cell => cell.length > 0)) {
          dataRows.push(tds);
        }
      });
    }
  });

  // Build the cells array
  const headerRow = ['Table (bordered, tableBordered40)'];
  const cells = [
    headerRow,
    headerCells,
    ...dataRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
