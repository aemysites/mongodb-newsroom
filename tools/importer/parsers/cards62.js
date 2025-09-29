/* global WebImporter */
export default function parse(element, { document }) {
  // Always use a single-cell header row
  const headerRow = ['Cards (cards62)'];
  const rows = [headerRow];

  // Find all cards
  const cardSections = element.querySelectorAll('[automation-testid="flora-FlashCard"]');

  cardSections.forEach((cardSection) => {
    // First cell: image/icon
    const img = cardSection.querySelector('img');
    // Second cell: text content (title, description, CTA)
    const cardContent = cardSection.querySelector('div[role="button"]');
    const frag = document.createDocumentFragment();
    // Title
    const h3 = cardContent.querySelector('h3');
    if (h3) frag.appendChild(h3.cloneNode(true));
    // Description
    const descDiv = cardContent.querySelector('[aria-label="text-content"]');
    if (descDiv) frag.appendChild(descDiv.cloneNode(true));
    // CTA
    const cta = cardContent.querySelector('.css-374oea');
    if (cta && cta.textContent.trim()) frag.appendChild(cta.cloneNode(true));
    rows.push([img, frag]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
