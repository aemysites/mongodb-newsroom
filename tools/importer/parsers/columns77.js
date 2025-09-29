/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns77)'];

  // Defensive: get all direct children of the inner lockup div
  // The structure is: element > div (flora-CTALockup) > div (button) + div (link)
  const lockup = element.querySelector('[automation-testid="flora-CTALockup"]');
  if (!lockup) return;

  // Get direct children of the lockup (should be two columns)
  const columns = Array.from(lockup.children);

  // Defensive: ensure we have at least two columns
  if (columns.length < 2) return;

  // Each column's content is a div, so we can reference them directly
  // This will ensure any nested structure (spans, links) is preserved
  const row = columns.map(col => col);

  // Build the table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
