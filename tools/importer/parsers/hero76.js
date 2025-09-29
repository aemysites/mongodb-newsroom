/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid container
  const grid = element.querySelector('[class*="grid"][class*="flex"]');
  if (!grid) return;

  // Identify text and image columns
  let textCol = null;
  let imgCol = null;
  grid.childNodes.forEach((child) => {
    if (child.querySelector && child.querySelector('img')) {
      imgCol = child.querySelector('img');
    }
    if (child.querySelector && child.querySelector('h1, h2, h3, h4, h5, h6')) {
      textCol = child;
    }
  });

  // Compose header row
  const headerRow = ['Hero (hero76)'];

  // Compose image row (reference the actual image element)
  const imageRow = [imgCol ? imgCol : ''];

  // Compose content row
  const contentParts = [];
  if (textCol) {
    // Heading (first h2/h1/h3...)
    const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Subheading/paragraphs
    textCol.querySelectorAll('span').forEach((span) => {
      span.querySelectorAll('p').forEach((p) => {
        if (p.textContent.trim()) contentParts.push(p);
      });
    });
    // CTA (link)
    const cta = textCol.querySelector('[data-testid="cta-element"] a');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts.length ? contentParts : ''];

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, imageRow, contentRow], document);

  // Replace element
  element.replaceWith(table);
}
