/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero20)'];

  // 2. Background image row (none in this HTML)
  const bgImageRow = [''];

  // 3. Content row: Heading and subheading
  // Defensive: find the heading and subheading containers
  let headingEl = null;
  let subheadingEl = null;

  // Find the first h2 (title)
  headingEl = element.querySelector('h2');
  // Find the subheading (span inside .css-1r84kvf)
  subheadingEl = element.querySelector('.css-1r84kvf');

  // Compose content cell
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl) contentCell.push(subheadingEl);

  // Table rows
  const rows = [
    headerRow,
    bgImageRow,
    [contentCell],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
