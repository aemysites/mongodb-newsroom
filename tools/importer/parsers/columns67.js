/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container for columns
  const grid = element.querySelector('.md\\:grid');
  if (!grid) return;

  // Find the two column containers
  const columns = Array.from(grid.children).filter((child) => child.tagName === 'DIV');
  if (columns.length < 2) return;

  // First column: text content (heading + paragraph)
  const textCol = columns[0];
  // Second column: image content
  const imageCol = columns[1];

  // Gather all content from first column
  const textEls = [];
  // Get heading
  const headingSpan = textCol.querySelector('[data-testid="article-title"]');
  if (headingSpan) {
    const h2 = headingSpan.querySelector('h2');
    if (h2) textEls.push(h2);
  }
  // Get paragraph
  const paraSpan = textCol.querySelector('span.css-gle6wn');
  if (paraSpan) {
    const p = paraSpan.querySelector('p');
    if (p) textEls.push(p);
  }

  // Gather image from second column
  let imgEl = null;
  const imgWrapper = imageCol.querySelector('[automation-testid="flora-SingleImage-Ratio"]');
  if (imgWrapper) {
    imgEl = imgWrapper.querySelector('img');
  }

  // Compose columns row
  const columnsRow = [
    textEls,
    imgEl ? [imgEl] : []
  ];

  // Build table
  const headerRow = ['Columns (columns67)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
