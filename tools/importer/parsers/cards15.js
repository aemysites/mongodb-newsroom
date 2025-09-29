/* global WebImporter */
export default function parse(element, { document }) {
  // Get each card container (direct children)
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Block header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  cardDivs.forEach((card) => {
    // Main content area
    const contentDiv = card.querySelector('.space-y-4');
    if (!contentDiv) return;

    // Image/Icon
    const img = contentDiv.querySelector('img');

    // Title (h6)
    const title = contentDiv.querySelector('h6');

    // Description (p)
    const desc = contentDiv.querySelector('p');

    // CTA link (Learn more)
    let ctaLink = null;
    const ctaDiv = card.querySelector('.mt-6');
    if (ctaDiv) {
      ctaLink = ctaDiv.querySelector('a');
    }

    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (ctaLink) textCell.push(ctaLink);

    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
