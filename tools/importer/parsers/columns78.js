/* global WebImporter */
export default function parse(element, { document }) {
  // Find the flex container that holds the columns
  const flexContainer = element.querySelector('[aria-label="flex-container"]');
  let columns = [];
  if (flexContainer) {
    // Only direct section children are columns
    columns = Array.from(flexContainer.children).filter(child => child.tagName === 'SECTION');
  }
  // Fallback: if not found, try to get all sections in the element
  if (columns.length === 0) {
    columns = Array.from(element.querySelectorAll('section[automation-testid="flora-FlashCard"]'));
  }

  // Edge case: if no columns found, do nothing
  if (columns.length === 0) return;

  // Table header as specified
  const headerRow = ['Columns (columns78)'];
  // Each column is a cell in the columns row, referencing the original section
  const columnsRow = columns.map(col => col);

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
