/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // Find the main grid container
  const gridSection = element.querySelector('[class*="grid"]');
  if (!gridSection) return;

  // Find the two main column containers
  // Left: image, Right: text
  let leftCol = null;
  let rightCol = null;
  const children = Array.from(gridSection.children);
  children.forEach((child) => {
    if (child.getAttribute('data-testid') === 'side-element') leftCol = child;
    if (child.getAttribute('data-testid') === 'article') rightCol = child;
  });
  if (!leftCol || !rightCol) return;

  // Extract image from left column
  let imageEl = leftCol.querySelector('img');
  // Defensive: if image is inside a wrapper, grab the wrapper
  let imageWrapper = null;
  if (imageEl) {
    imageWrapper = imageEl.closest('[automation-testid="flora-SingleImage-Ratio"]') || imageEl;
  }

  // Extract title and paragraph from right column
  let titleSpan = rightCol.querySelector('[data-testid="article-title"]');
  let titleEl = titleSpan ? titleSpan.querySelector('h2') : null;
  let paragraphSpan = rightCol.querySelector('span.css-gle6wn');
  let paragraphEl = paragraphSpan ? paragraphSpan.querySelector('p') : null;

  // Compose right column cell
  const rightCell = [];
  if (titleEl) rightCell.push(titleEl);
  if (paragraphEl) rightCell.push(paragraphEl);

  // Compose left column cell
  const leftCell = imageWrapper ? [imageWrapper] : [];

  // Table header
  const headerRow = ['Columns (columns71)'];
  // Table content row: image | text
  const contentRow = [leftCell, rightCell];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
