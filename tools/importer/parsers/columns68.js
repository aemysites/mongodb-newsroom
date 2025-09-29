/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the flex container that holds the columns
  const flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) return;

  // Each section is a column
  const sections = Array.from(flexContainer.querySelectorAll(':scope > section'));

  // Build columns: each cell will contain the full content of a section
  const columns = sections.map((section) => {
    // Defensive: find the inner content div
    const contentDiv = section.querySelector('.css-169lodi');
    if (!contentDiv) return section;
    return contentDiv;
  });

  // Table header row
  const headerRow = ['Columns (columns68)'];

  // Table columns row (one row, N columns)
  const columnsRow = columns;

  // Assemble table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
