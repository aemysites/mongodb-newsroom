/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a section
  function extractCardContent(section) {
    const anchor = section.querySelector('a');
    if (!anchor) return null;

    const heading = anchor.querySelector('h3');
    const description = anchor.querySelector('p');
    const cta = anchor.querySelector('.css-374oea');

    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    if (cta && anchor.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = anchor.href;
      ctaLink.textContent = cta.textContent;
      cellContent.push(ctaLink);
    }
    return cellContent;
  }

  // Find all card sections
  let flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) flexContainer = element;
  const sections = flexContainer.querySelectorAll(':scope > section');

  const headerRow = ['Cards (cardsNoImages4)'];
  const rows = [headerRow];
  sections.forEach((section) => {
    const cellContent = extractCardContent(section);
    if (cellContent && cellContent.length) {
      rows.push([cellContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
