/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns82)'];

  // Defensive: find the flex container that holds the column sections
  // The structure is: section > div > div > div[aria-label="flex-container"] > section* (each column)
  let flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) {
    // fallback: try to find direct section children
    flexContainer = element;
  }

  // Find all immediate section children (each is a column)
  const columnSections = Array.from(flexContainer.querySelectorAll(':scope > section'));

  // If we don't find any, fallback to direct children
  const columns = columnSections.length > 0 ? columnSections : Array.from(flexContainer.children);

  // For each column, extract the main content (the <a> inside)
  const columnCells = columns.map((col) => {
    // Defensive: find the main content anchor
    const anchor = col.querySelector('a');
    if (anchor) {
      return anchor;
    }
    // fallback: use the column itself
    return col;
  });

  // Compose the table rows
  const rows = [
    headerRow,
    columnCells,
  ];

  // Create the table using the WebImporter DOM utility
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
