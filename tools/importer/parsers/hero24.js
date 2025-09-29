/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main container (may be section or div)
  const main = element;

  // 1. Header row
  const headerRow = ['Hero (hero24)'];

  // 2. Background image row (none in this HTML)
  // This source block does not contain a background image element, so leave cell empty
  const bgImageRow = [''];

  // 3. Content row: Title, Subheading, CTA
  // Find the inner container
  const inner = main.querySelector(':scope > div');
  let title, subheading, ctaLink;

  if (inner) {
    // Find left content (title + subheading)
    const left = inner.querySelector(':scope > div');
    if (left) {
      // Title (h2)
      title = left.querySelector('h2');
      // Subheading (h4)
      subheading = left.querySelector('h4');
    }
    // Find CTA (button inside link)
    const ctaA = inner.querySelector('a[href]');
    if (ctaA) {
      // Defensive: wrap button text in a link for CTA
      const btn = ctaA.querySelector('button');
      if (btn) {
        // Create a link element for CTA
        const link = document.createElement('a');
        link.href = ctaA.getAttribute('href');
        link.textContent = btn.textContent;
        ctaLink = link;
      }
    }
  }

  // Compose content cell
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (ctaLink) contentCell.push(ctaLink);

  // Table rows
  const rows = [
    headerRow,
    bgImageRow,
    [contentCell]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
