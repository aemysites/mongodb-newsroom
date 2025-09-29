/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Find the grid container (the main row)
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // 2. Find the two main columns (image and content)
  //    The first col has data-testid="side-element"
  //    The second col has data-testid="article"
  const sideCol = grid.querySelector('[data-testid="side-element"]');
  const articleCol = grid.querySelector('[data-testid="article"]');

  // Defensive: If not found, fallback to first and second direct children
  const columns = [];
  if (sideCol && articleCol) {
    columns.push(sideCol, articleCol);
  } else {
    // fallback: get all direct children
    const gridChildren = Array.from(grid.children);
    if (gridChildren.length >= 2) {
      columns.push(gridChildren[0], gridChildren[1]);
    } else {
      // fallback: just use grid
      columns.push(grid);
    }
  }

  // 3. Prepare the table rows
  const headerRow = ['Columns (columns65)'];
  const columnsRow = columns;

  // 4. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
