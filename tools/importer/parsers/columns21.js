/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children (should be two columns)
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only process if there are at least two columns
  if (children.length < 2) return;

  // Prepare header row
  const headerRow = ['Columns (columns21)'];

  // Each column cell must reference the existing element (not clone)
  const columnsRow = children;

  // Build table data
  const tableData = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
