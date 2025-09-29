/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const rows = [['Cards (cards60)']];

  // Find all card sections
  const flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) return;
  const sections = flexContainer.querySelectorAll(':scope > section');

  sections.forEach((section) => {
    // Image/Icon (mandatory)
    const img = section.querySelector('img');
    // Text content container
    const textContainer = section.querySelector('.css-15ss6cm');
    if (!img || !textContainer) return;

    // Title
    const title = textContainer.querySelector('h3');
    // Description
    const desc = textContainer.querySelector('p');
    // CTA
    const ctaSpan = textContainer.querySelector('.css-374oea');
    const cardLink = section.querySelector('a');
    let cta = null;
    if (ctaSpan && cardLink) {
      cta = document.createElement('a');
      cta.href = cardLink.href;
      cta.textContent = ctaSpan.textContent;
      if (cardLink.target === '_blank') {
        cta.target = '_blank';
        cta.rel = 'noopener noreferrer';
      }
    }

    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    rows.push([img, textCell]);
  });

  // Create and replace with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
