/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by tag name
  function getDirectChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName.toLowerCase() === tag);
  }

  // 1. Header row
  const headerRow = ['Hero (hero27)'];

  // 2. Background image row
  let bgImgCell = '';
  // Find the first .header__bg that contains an <img>
  let bgImgDiv = Array.from(element.querySelectorAll(':scope > div.header__bg')).find(div => div.querySelector('img'));
  if (bgImgDiv) {
    const img = bgImgDiv.querySelector('img');
    if (img) bgImgCell = img;
  }

  // 3. Content row: headline, subheading, CTA (if present)
  let contentCell = '';
  // Find the div that contains the headline
  let contentDiv = Array.from(element.querySelectorAll(':scope > div')).find(div => div.querySelector('h1'));
  if (contentDiv) {
    // Gather all children of contentDiv
    const contentEls = [];
    // Headline (h1)
    const h1 = contentDiv.querySelector('h1');
    if (h1) contentEls.push(h1);
    // Subheading, CTA, etc. (not present in this example, but future-proof)
    // If there are other elements (e.g., p, h2, a) inside contentDiv, add them
    Array.from(contentDiv.children).forEach(child => {
      if (child !== h1) {
        contentEls.push(child);
      }
    });
    contentCell = contentEls;
  }

  // Build the table rows
  const rows = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
