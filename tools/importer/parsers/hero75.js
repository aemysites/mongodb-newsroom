/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('[class*="grid"]');
  if (!grid) return;

  // Find the text and image columns
  let textCol = grid.querySelector('[data-testid="article"]');
  let imageCol = grid.querySelector('img');

  // Block header row
  const headerRow = ['Hero (hero75)'];

  // Image row (background asset)
  let imageRow = [''];
  if (imageCol) {
    imageRow = [imageCol]; // Reference the actual <img> element
  }

  // Content row: headline, subheading, paragraph, CTA (if any)
  let contentRow = [''];
  if (textCol) {
    // Gather all direct children (spans) and their children (headings, paragraphs)
    const contentEls = [];
    textCol.childNodes.forEach((node) => {
      if (node.nodeType === 1 && node.tagName === 'SPAN') {
        node.childNodes.forEach((child) => {
          if (child.nodeType === 1) {
            contentEls.push(child);
          }
        });
      }
    });
    if (contentEls.length) {
      contentRow = [contentEls];
    }
  }

  // Compose the table as per block spec
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
