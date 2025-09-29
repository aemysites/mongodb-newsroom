/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns32)'];

  // Get all immediate child <a> elements (each award)
  const awardLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Defensive: If there are no awards, do nothing
  if (!awardLinks.length) return;

  // Each award is visually a column, so each <a> becomes a cell in the second row
  // Reference the entire <a> element for resilience
  const columnsRow = awardLinks.map((award) => award);

  // Build the table
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
