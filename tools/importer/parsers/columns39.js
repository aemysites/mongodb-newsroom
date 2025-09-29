/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing the columns
  const grid = element.querySelector('.grid');
  if (!grid) return;

  // Find all direct child columns (divs with col-span-*) that have actual content
  const columnsEls = Array.from(grid.children).filter(
    (col) => col.matches('div') && (col.querySelector('img') || col.querySelector('[data-testid="article"]'))
  );

  // Build columns array: always two columns for this block
  let imageCell = '';
  let contentCell = '';

  // Image column
  const imageCol = columnsEls.find(col => col.querySelector('img'));
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) imageCell = img;
  }

  // Content column
  const contentCol = columnsEls.find(col => col.querySelector('[data-testid="article"]'));
  if (contentCol) {
    const article = contentCol.querySelector('[data-testid="article"]');
    if (article) {
      // Collect all direct children of article (title, description, cta)
      const children = Array.from(article.children);
      if (children.length) contentCell = children;
    }
  }

  // If both columns are empty, do nothing
  if (!imageCell && !contentCell) return;

  // Always output two columns for this block, but if one is empty, use ''
  const columnsRow = [imageCell || '', contentCell || ''];

  // Table header
  const headerRow = ['Columns (columns39)'];

  // Build table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
