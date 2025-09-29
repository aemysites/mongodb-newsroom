/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns80)'];

  // Defensive: find the flex container holding the sections
  const flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) return;

  // Get all immediate child sections (each column)
  const sections = Array.from(flexContainer.querySelectorAll(':scope > section'));
  if (sections.length === 0) return;

  // Each section is a column; extract the full content of each section
  const columnsRow = sections.map((section) => section);

  // Build the table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
