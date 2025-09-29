/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main image (background/decorative)
  function findMainImage(el) {
    // Look for the first <img> in the subtree
    return el.querySelector('img');
  }

  // Helper to find the text content container flexibly
  function findTextContainer(el) {
    // Find the first div that contains an h5 (title)
    return el.querySelector('div:has(h5)');
  }

  // --- Build the table rows ---
  const headerRow = ['Hero (hero10)'];

  // 2nd row: Background image (optional)
  const mainImg = findMainImage(element);
  const imageRow = [mainImg ? mainImg : ''];

  // 3rd row: Title, subheading, CTA (no image, no extra divs)
  const textContainer = findTextContainer(element);
  let textContent = [];
  if (textContainer) {
    // Title: h5
    const h = textContainer.querySelector('h5');
    if (h) textContent.push(h.cloneNode(true));
    // Subheading: span.css-ijq421
    const sub = textContainer.querySelector('.css-ijq421');
    if (sub) textContent.push(sub.cloneNode(true));
    // CTA: span.css-1w632qo
    const cta = textContainer.querySelector('.css-1w632qo');
    if (cta) textContent.push(cta.cloneNode(true));
  }
  const textRow = [textContent.length ? textContent : ''];

  // Compose the table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
