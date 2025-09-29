/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the main card content from a card root
  function extractCardContent(cardRoot) {
    // Find the main content area (the white card)
    const cardContent = cardRoot.querySelector('.css-eeqf');
    if (!cardContent) return null;
    const cardParts = [];

    // Heading: prefer h1, then h3, then h5
    let heading = cardContent.querySelector('h1, h3, h5');
    if (heading) cardParts.push(heading.cloneNode(true));

    // Description: all <span class="css-zmu6zu"> > div > p
    let descWrapper = cardContent.querySelector('.css-zmu6zu > div');
    if (descWrapper) {
      descWrapper.querySelectorAll('p').forEach((p) => {
        cardParts.push(p.cloneNode(true));
      });
    }

    // CTA: look for direct <a> with visible text and not in menu/buttons
    // Only include 'Learn more' or 'View on Github' style links
    // These are direct children of cardContent
    cardContent.querySelectorAll('a').forEach((a) => {
      // Only include if it has visible text and isn't inside a button or menu
      if (
        a.closest('button') ||
        a.closest('.css-l5xv05') ||
        (a.closest('.css-1f8wtjh') && !a.classList.contains('css-136a79w'))
      ) {
        return;
      }
      // Only include the 'Learn more' or 'View on Github' style links
      const txt = a.textContent.trim().toLowerCase();
      if (txt.startsWith('learn more') || txt.startsWith('view on github') || txt.startsWith('installation')) {
        cardParts.push(a.cloneNode(true));
      }
    });

    // If no heading, description, or CTA found, fallback to all text in cardContent
    if (cardParts.length === 0) {
      // Get all text nodes inside cardContent
      const text = cardContent.textContent.trim();
      if (text) cardParts.push(document.createTextNode(text));
    }

    return cardParts;
  }

  // Find all card containers: divs with class css-u1flw3 (each card)
  const cardRoots = element.querySelectorAll('.css-u1flw3');
  const rows = [];
  // Always start with the block header
  const headerRow = ['Cards (cardsNoImages98)'];
  rows.push(headerRow);

  cardRoots.forEach((cardRoot) => {
    const cardParts = extractCardContent(cardRoot);
    if (cardParts && cardParts.length > 0) {
      rows.push([cardParts]);
    }
  });

  // If no cards found, fallback: try to get all text from the element
  if (rows.length === 1) {
    const text = element.textContent.trim();
    if (text) rows.push([document.createTextNode(text)]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
