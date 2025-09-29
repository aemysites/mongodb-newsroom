/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate card sections
  const cardSections = Array.from(
    element.querySelectorAll('[automation-testid="flora-FlashCard"]')
  );

  // Table header row
  const headerRow = ['Cards (cards83)'];
  const rows = [headerRow];

  cardSections.forEach((section) => {
    // Image/Icon (first cell)
    const imgSpan = section.querySelector('[aria-label="card-header"]');
    let imageEl = null;
    if (imgSpan) {
      imageEl = imgSpan.querySelector('img');
    }

    // Text content (second cell)
    const contentSpan = section.querySelector('.css-1o2jinw');
    let textContent = [];
    if (contentSpan) {
      // Title (h2)
      const titleEl = contentSpan.querySelector('h2');
      if (titleEl) textContent.push(titleEl);
      // Description (div with aria-label="text-content")
      const descEl = contentSpan.querySelector('[aria-label="text-content"]');
      if (descEl) textContent.push(descEl);
      // Call-to-action (span.css-374oea)
      // If there is a link inside, use the link, else skip or use as is
      let ctaEl = null;
      const ctaSpan = contentSpan.querySelector('.css-374oea');
      if (ctaSpan) {
        // Try to find a link inside the ctaSpan
        const link = ctaSpan.querySelector('a');
        if (link) {
          ctaEl = link;
        } else {
          // Try to find a link in the card section (sometimes CTA is not inside span)
          const fallbackLink = section.querySelector('a');
          if (fallbackLink && fallbackLink.textContent.trim().toLowerCase().includes('learn more')) {
            ctaEl = fallbackLink;
          }
        }
        if (ctaEl) {
          textContent.push(ctaEl);
        }
      }
    }

    rows.push([
      imageEl || '',
      textContent.length > 0 ? textContent : '',
    ]);
  });

  // Create and replace block with proper colspan for header
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header row colspan if needed
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1 && cardSections.length > 0) {
    firstRow.children[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
