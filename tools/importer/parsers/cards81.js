/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections
  const cardSections = element.querySelectorAll('section.css-1kc1w35');

  // Prepare table rows
  const rows = [];
  // Always use the required header row
  rows.push(['Cards (cards81)']);

  cardSections.forEach((section) => {
    // Find the image (logo/icon)
    const img = section.querySelector('img');
    if (!img) return;

    // Find the text content for the card
    // The text content is in the next sibling span after card-header
    let textContent = '';
    const headerSpan = section.querySelector('span[aria-label="card-header"]');
    let textSpan = null;
    if (headerSpan) {
      textSpan = headerSpan.nextElementSibling;
    }
    if (textSpan && textSpan.textContent.trim()) {
      textContent = textSpan.textContent.trim();
    } else {
      // Fallback: get all text except image alt
      let allText = section.textContent.trim();
      if (img.alt && allText.includes(img.alt)) {
        allText = allText.replace(img.alt, '').trim();
      }
      textContent = allText;
    }
    // Only add row if textContent is not empty
    if (textContent) {
      rows.push([
        img,
        textContent
      ]);
    }
  });

  // Create the cards table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
