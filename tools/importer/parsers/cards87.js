/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from section
  function extractCard(section) {
    // Find image/icon (reference existing element)
    const img = section.querySelector('img');
    // Find title (h3)
    const h3 = section.querySelector('h3');
    // Find description (p)
    const desc = section.querySelector('p');
    // Find CTA (span with 'Learn more') and link
    let cta = null;
    let link = null;
    const a = section.querySelector('a');
    if (a) {
      link = a.getAttribute('href');
      cta = a.querySelector('.css-374oea');
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (h3) {
      const heading = document.createElement('strong');
      heading.textContent = h3.textContent;
      textCell.appendChild(heading);
    }
    if (desc) {
      const para = document.createElement('p');
      para.textContent = desc.textContent;
      textCell.appendChild(para);
    }
    if (cta && link) {
      const ctaLink = document.createElement('a');
      ctaLink.href = link;
      ctaLink.textContent = cta.textContent;
      textCell.appendChild(ctaLink);
    }
    return [img, textCell];
  }

  // Find all card sections
  const cardsContainer = element.querySelector('.css-15oue90');
  const sections = cardsContainer ? cardsContainer.querySelectorAll(':scope > section') : [];

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards87)']);
  // Card rows
  sections.forEach((section) => {
    rows.push(extractCard(section));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
