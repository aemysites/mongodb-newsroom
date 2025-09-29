/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a FlashCard section
  function extractCard(section) {
    // Find the image/icon (reference the existing element, do not clone)
    const img = section.querySelector('img');
    // Find the title (h3)
    const title = section.querySelector('h3');
    // Find the description (p inside aria-label="text-content")
    let desc = null;
    const descWrapper = section.querySelector('[aria-label="text-content"]');
    if (descWrapper) {
      desc = descWrapper.querySelector('p');
    }
    // Find CTA (the last span with class css-374oea)
    const cta = section.querySelector('.css-374oea');

    // Compose text cell: preserve semantic order and reference existing elements
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    return [img, textCell];
  }

  // Get all card sections
  const cardSections = Array.from(element.querySelectorAll(':scope section[automation-testid="flora-FlashCard"]'));

  // Table header
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Each card becomes a row
  cardSections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
