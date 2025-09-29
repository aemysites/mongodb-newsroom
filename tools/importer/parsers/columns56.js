/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildrenBySelector(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the main grid container
  const grid = element.querySelector('.flex.flex-col-reverse.m-auto.max-w-maxWidthDesktop');
  if (!grid) return;

  // Get the two main column containers
  // Left column: text & CTA
  // Right column: image
  const columns = getImmediateChildrenBySelector(grid, 'div');
  if (columns.length < 2) return;

  // Left column: text content and CTA
  const leftCol = columns[0];
  // Right column: image
  const rightCol = columns[1];

  // --- LEFT COLUMN ---
  // Get title (h2), description (p), CTA (a)
  const titleSpan = leftCol.querySelector('span[data-testid="article-title"]');
  const title = titleSpan ? titleSpan.querySelector('h2') : null;
  const descSpan = leftCol.querySelector('span.css-gle6wn');
  const desc = descSpan ? descSpan.querySelector('p') : null;
  const ctaDiv = leftCol.querySelector('div[data-testid="cta-element"]');
  const ctaLink = ctaDiv ? ctaDiv.querySelector('a') : null;

  // Compose left column cell content
  const leftCellContent = [];
  if (title) leftCellContent.push(title);
  if (desc) leftCellContent.push(desc);
  if (ctaLink) leftCellContent.push(ctaLink);

  // --- RIGHT COLUMN ---
  // Get image element
  const imageDiv = rightCol.querySelector('div[automation-testid="flora-SingleImage-Ratio"]');
  let image = null;
  if (imageDiv) {
    image = imageDiv.querySelector('img');
  }

  // Compose right column cell content
  const rightCellContent = [];
  if (image) rightCellContent.push(image);

  // Table rows
  const headerRow = ['Columns (columns56)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace original element
  element.replaceWith(table);
}
