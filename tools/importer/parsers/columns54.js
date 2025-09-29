/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child divs of the footer (these are the columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare array for each column's content
  const cells = [];

  // 1. Logo + copyright column (first column)
  const logoCol = document.createElement('div');
  // Clone logo div (contains <a><img></a>)
  const logoDiv = columns[0].querySelector('.css-vtlrs4');
  if (logoDiv) logoCol.appendChild(logoDiv.cloneNode(true));
  // Copyright text (in first or last div)
  const copyrightDiv = columns[0].querySelector('.css-1v2onxv');
  if (copyrightDiv) logoCol.appendChild(copyrightDiv.cloneNode(true));
  // Sometimes copyright is in last div
  const lastCol = columns[columns.length - 1];
  if (lastCol.classList.contains('css-ofkua7')) {
    if (!logoCol.textContent.includes(lastCol.textContent)) {
      logoCol.appendChild(lastCol.cloneNode(true));
    }
  }
  cells.push(logoCol);

  // 2. Each navigation column (About, Support, Deployment Options, Data Basics)
  for (let i = 1; i < columns.length; i++) {
    const col = columns[i];
    // Only use columns with nav sections (skip copyright-only column)
    if (
      col.querySelector('ul') &&
      (col.classList.contains('css-suc1e') || col.classList.contains('css-j2dfd1'))
    ) {
      // Clone the whole column div to preserve all text and structure
      cells.push(col.cloneNode(true));
    }
  }

  // Table header row
  const headerRow = ['Columns (columns54)'];

  // Compose the table data
  const tableData = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
