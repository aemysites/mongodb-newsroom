/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image/icon from a card
  function getCardImage(card) {
    // Look for an img inside the card
    const img = card.querySelector('img');
    if (img) return img;
    // If not found, look for an svg icon inside a span/div
    const svgSpan = card.querySelector('span > img, span > svg, div > img, div > svg');
    if (svgSpan) return svgSpan;
    // If not found, look for an svg directly
    const svg = card.querySelector('svg');
    if (svg) return svg;
    return null;
  }

  // Helper to extract text content from a card
  function getCardText(card) {
    const textContent = document.createElement('div');
    // Title
    let title = card.querySelector('h3, h2, h1');
    if (!title) {
      // Sometimes the title is just the first strong/bold or first text node
      title = card.querySelector('strong, b');
    }
    if (title) {
      textContent.appendChild(title.cloneNode(true));
    }
    // Pricing info (e.g. $/hour, small, etc)
    // Add all pricing info in order of appearance
    const pricingInfoNodes = card.querySelectorAll('.fnt-20, small, .pricing-card__PricingInfo-sc-1rrr1xw-4');
    pricingInfoNodes.forEach((node) => {
      if (!textContent.contains(node)) {
        textContent.appendChild(node.cloneNode(true));
      }
    });
    // Description: all p, and all divs/spans with text, not already included
    const descs = Array.from(card.querySelectorAll('p, div, span'))
      .filter(el => el.textContent && el !== title && el.children.length === 0 && el.textContent.trim().length > 0 && !textContent.contains(el));
    descs.forEach(desc => {
      textContent.appendChild(desc.cloneNode(true));
    });
    // Features: spans with icons and text, or list items
    const featuresContainer = card.querySelector('.pricing-card__FeaturesContainer-sc-1rrr1xw-3');
    if (featuresContainer && !textContent.contains(featuresContainer)) {
      textContent.appendChild(featuresContainer.cloneNode(true));
    }
    // CTA button or link (all a.btn*, a.link)
    let ctas = card.querySelectorAll('a.btn-green, a.btn-outlined, a.btn, a.link');
    ctas.forEach(cta => {
      if (!textContent.contains(cta)) {
        textContent.appendChild(cta.cloneNode(true));
      }
    });
    return textContent;
  }

  // Get all card elements (direct children)
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards1)'];
  rows.push(headerRow);

  // Each card becomes a row: [image/icon, text content]
  cards.forEach(card => {
    // Defensive: skip dividers or empty divs
    if (
      card.classList.contains('divider') ||
      card.children.length === 0 ||
      card.textContent.trim() === ''
    ) {
      return;
    }
    // Find the main content container
    let mainContent = card.querySelector('.pricing-card__MainCardContent-sc-1rrr1xw-2');
    if (!mainContent) mainContent = card;
    // Image/Icon
    const image = getCardImage(mainContent) || getCardImage(card);
    // Text
    const text = getCardText(mainContent);
    rows.push([image, text]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
