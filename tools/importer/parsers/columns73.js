/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row container
  let columnsRow = null;
  let textCol = null;
  let imageCol = null;

  // The main structure is:
  // .css-1iw8wf0 > .css-15szs5 > .css-1lpvf0e > .css-1vy9swr (row)
  //   > .css-15ktc2y (empty?)
  //   > .css-1fci34v (image)
  // .css-1nu61ns (text and link)

  // Find the deepest row container
  const firstLevel = element.querySelector(':scope > div');
  if (firstLevel) {
    const secondLevel = firstLevel.querySelector(':scope > div');
    if (secondLevel) {
      columnsRow = secondLevel.querySelector(':scope > div');
    }
  }

  // Now, columnsRow should be the .css-1vy9swr
  if (columnsRow) {
    // The image is in the second child
    const colChildren = columnsRow.querySelectorAll(':scope > div');
    if (colChildren.length >= 2) {
      imageCol = colChildren[1];
    }
  }

  // The text column is the next sibling after columnsRow
  if (columnsRow && columnsRow.parentElement) {
    const maybeText = columnsRow.parentElement.nextElementSibling;
    if (maybeText && maybeText.classList.contains('css-1nu61ns')) {
      textCol = maybeText;
    }
  }

  // Defensive fallback: if not found, try to find .css-1nu61ns directly
  if (!textCol) {
    textCol = element.querySelector('.css-1nu61ns');
  }

  // Compose the columns row
  const columns = [];

  // Left: textCol (What to expect, description, link)
  if (textCol) {
    columns.push(textCol);
  } else {
    columns.push('');
  }

  // Right: imageCol (contains the image)
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) {
      columns.push(img);
    } else {
      columns.push('');
    }
  } else {
    columns.push('');
  }

  // Build the table rows
  const headerRow = ['Columns (columns73)'];
  const contentRow = columns;
  const tableRows = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
