/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card image or icon (img or mdb-icon)
  function extractCardImage(card) {
    // Try to find an <img> tag
    const img = card.querySelector('img');
    if (img) return img;
    // Try to find an <mdb-icon> tag
    const icon = card.querySelector('mdb-icon');
    if (icon) return icon;
    return null;
  }

  // Helper to extract card title (h4 > span or h4)
  function extractCardTitle(card) {
    const h4 = card.querySelector('h4');
    if (h4) {
      // Use the <span> inside h4 if present, else h4 itself
      const span = h4.querySelector('span');
      if (span) return span;
      return h4;
    }
    return null;
  }

  // Helper to extract card description (div.CardGrid__CardDescription-sc-4okswf-9)
  function extractCardDescription(card) {
    const desc = card.querySelector('.CardGrid__CardDescription-sc-4okswf-9');
    if (desc) return desc;
    return null;
  }

  // Helper to extract CTA (link wrapper with p.link)
  function extractCardCTA(card) {
    const linkWrapper = card.querySelector('.CardGrid__LinkWrapper-sc-4okswf-10');
    if (linkWrapper) {
      // Find the <p class="link"> inside linkWrapper
      const p = linkWrapper.querySelector('p.link');
      if (p) {
        // Find the parent <a> (the card itself)
        let a = card.closest('a');
        // If not found, try to find the first <a> ancestor
        if (!a) a = card.querySelector('a');
        if (a && a.href) {
          // Create a link element
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          link.innerHTML = p.innerHTML;
          return link;
        }
      }
    }
    return null;
  }

  // Find all card <a> elements (direct children of the block)
  const cards = Array.from(element.querySelectorAll(':scope > a'));

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards85)']);

  // For each card, extract image/icon, title, description, CTA
  cards.forEach((card) => {
    const cardBox = card.querySelector('div.fl-column.fl-justify-between');
    // Defensive: fallback to card if cardBox not found
    const cardContent = cardBox || card;

    // First cell: image or icon
    const imageOrIcon = extractCardImage(cardContent);

    // Second cell: text content (title, description, CTA)
    const textContent = [];
    const title = extractCardTitle(cardContent);
    if (title) {
      // Wrap title in <strong> if it's not already
      if (title.tagName && title.tagName.toLowerCase() === 'span') {
        const strong = document.createElement('strong');
        strong.appendChild(title.cloneNode(true));
        textContent.push(strong);
      } else {
        textContent.push(title.cloneNode(true));
      }
    }
    const desc = extractCardDescription(cardContent);
    if (desc) {
      // If description is a <div> with <span> or <p>, use its children
      if (desc.children.length === 1 && (desc.firstElementChild.tagName === 'SPAN' || desc.firstElementChild.tagName === 'P')) {
        textContent.push(desc.firstElementChild.cloneNode(true));
      } else {
        textContent.push(desc.cloneNode(true));
      }
    }
    const cta = extractCardCTA(card);
    if (cta) {
      textContent.push(cta);
    }
    // Defensive: if no text content, push a blank
    if (textContent.length === 0) textContent.push('');

    rows.push([
      imageOrIcon ? imageOrIcon.cloneNode(true) : '',
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
