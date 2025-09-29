/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // 1. Header row
  const headerRow = ['Columns (columns22)'];

  // Find the main container for columns (the direct children of the root footer)
  const mainDivs = getDirectChildren(element, 'div');

  // Compose columns: Each column is a div with heading and list
  const columns = [];

  // First column: logo, language selector, copyright
  const firstColDiv = mainDivs[0];
  let firstColContent = [];
  if (firstColDiv) {
    Array.from(firstColDiv.children).forEach(child => {
      firstColContent.push(child);
    });
  }
  // Some footers have copyright at the end
  const copyrightDiv = mainDivs[5];
  if (copyrightDiv && /css-1lzfsvk|css-ofkua7/.test(copyrightDiv.className)) {
    firstColContent.push(copyrightDiv);
  }
  if (firstColContent.length) columns.push(firstColContent);

  // Next columns: About, Support, Deployment Options, Data Basics
  for (let i = 1; i < mainDivs.length; i++) {
    const div = mainDivs[i];
    if (!div) continue;
    // Collect all direct children (heading, list, etc.)
    const colContent = [];
    Array.from(div.children).forEach(child => {
      colContent.push(child);
    });
    if (colContent.length) columns.push(colContent);
  }

  // Ensure each cell is a valid cell (string, element, or array of elements)
  const secondRow = columns.map(col => Array.isArray(col) ? col : [col]);

  // Build the table rows: header, then a single row with each column as a cell
  const rows = [headerRow, secondRow];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
