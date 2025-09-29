/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // 1. Find the grid container (contains the two columns)
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // 2. Find the two column containers (image/video and text)
  // Left column: contains image with overlay
  const leftCol = grid.querySelector('[data-testid="side-element"]');
  // Right column: contains article content
  const rightCol = grid.querySelector('[data-testid="article"]');
  if (!leftCol || !rightCol) return;

  // 3. Prepare left column content (visual)
  // Use the entire leftCol so that the image, overlay, and play button are preserved
  // Remove any empty wrappers if necessary (not needed here, as structure is stable)
  
  // 4. Prepare right column content (title, description, list, CTA)
  // Use the entire rightCol so that all structure is preserved

  // 5. Build the table rows
  const headerRow = ['Columns (columns90)'];
  const contentRow = [leftCol, rightCol];

  const rows = [headerRow, contentRow];

  // 6. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 7. Replace the original element with the new block table
  element.replaceWith(table);
}
