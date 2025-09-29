/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex row container
  const mainRow = element.querySelector('div[automation-testid="bonsai-QuoteCase"]');
  if (!mainRow) return;

  // Get the direct children of the main row
  const children = Array.from(mainRow.children);

  // The expected columns visually are: logo (left), content (right)
  // The bracket SVG (middle child) is decorative, not content
  // So: columns = [logoCol, contentCol]

  // 1. Logo column: first child
  let logoCol = null;
  const logoWrap = children[0];
  if (logoWrap) {
    // Only include if it contains an <img>
    const logoImg = logoWrap.querySelector('img');
    if (logoImg) logoCol = logoWrap;
  }

  // 2. Content column: third child
  let contentCol = null;
  const contentWrap = children[2];
  if (contentWrap) {
    contentCol = contentWrap;
  }

  // Defensive: If contentCol is missing, abort
  if (!contentCol) return;

  // Compose columns: [logo, content]
  const columns = [logoCol, contentCol].filter(Boolean);

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns3)'];
  // Table content row: reference actual DOM nodes
  const contentRow = columns;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
