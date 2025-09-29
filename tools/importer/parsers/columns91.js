/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract paired columns from a single section
  function extractColumnsFromSection(section) {
    // Find the grid container (may be grid or flex)
    let grid = section.querySelector('[class*="grid"], [class*="flex"]');
    if (!grid) grid = section; // fallback
    // Get direct children with data-testid side-element or article
    const columns = [];
    const children = Array.from(grid.children);
    // Find all side-element and article pairs (order may vary)
    let left = null, right = null;
    children.forEach((child) => {
      if (child.getAttribute('data-testid') === 'side-element') {
        left = child;
      } else if (child.getAttribute('data-testid') === 'article') {
        right = child;
      }
    });
    // Sometimes the image is on the right, sometimes on the left
    if (left && right) {
      // Check order in DOM
      if (left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING) {
        columns.push(left, right);
      } else {
        columns.push(right, left);
      }
    } else {
      // fallback: just push all children
      children.forEach((child) => columns.push(child));
    }
    return columns;
  }

  // Find all bonsai-Slalom sections (each is a row)
  const slaloms = element.querySelectorAll('[automation-testid="bonsai-Slalom"]');
  const rows = [];
  // Always start with the header row
  const headerRow = ['Columns (columns91)'];
  rows.push(headerRow);

  // For each bonsai-Slalom, extract columns
  slaloms.forEach((slalom) => {
    // Each slalom contains a grid/flex with two main children: image and content
    const cols = extractColumnsFromSection(slalom).map((col) => col);
    // Defensive: only add if we have 2 columns
    if (cols.length === 2) {
      rows.push(cols);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
