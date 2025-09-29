/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract text content from an element
  function getText(el) {
    return el ? el.textContent.trim() : '';
  }

  // Find the card grid
  const cardList = element.querySelector('ul.pf-microsite-grid');
  if (!cardList) return;

  // Get all card-item <li> elements
  const cardItems = Array.from(cardList.querySelectorAll('li.card-item'));

  // Table header row
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  cardItems.forEach((li) => {
    const a = li.querySelector('a');
    if (!a) return;

    // First cell: image or icon (mandatory)
    let iconCell;
    const img = a.querySelector('img');
    if (img) {
      iconCell = img;
    } else {
      // Use the content type text as an icon substitute
      const typeDiv = a.querySelector('.pf-item-content-name');
      if (typeDiv && getText(typeDiv)) {
        const span = document.createElement('span');
        span.textContent = getText(typeDiv);
        span.className = 'no-image-icon';
        iconCell = span;
      } else {
        const span = document.createElement('span');
        span.textContent = ' ';
        span.className = 'no-image-icon';
        iconCell = span;
      }
    }

    // Second cell: collect all text content from the anchor
    // This ensures all text is included, even if not in a specific class
    const contentCell = [];
    // Title
    const titleDiv = a.querySelector('.pf-item-title');
    if (titleDiv && getText(titleDiv)) {
      const h3 = document.createElement('h3');
      h3.innerHTML = titleDiv.innerHTML;
      contentCell.push(h3);
    }
    // Description
    const descDiv = a.querySelector('.pf-item-description');
    if (descDiv) {
      const descInner = descDiv.querySelector('div');
      if (descInner && getText(descInner)) {
        const p = document.createElement('p');
        p.innerHTML = descInner.innerHTML;
        contentCell.push(p);
      }
    }
    // CTA (call-to-action)
    const ctaDiv = a.querySelector('.pf-action-label');
    if (ctaDiv) {
      // Try to find a link inside CTA
      let ctaText = '';
      let ctaLink = null;
      // Sometimes CTA is a <div> with text and an <i> arrow
      // Use the text before the arrow
      ctaText = ctaDiv.textContent.replace(/\s*→?\s*$/, '').trim();
      if (a.href && a.href !== 'javascript:void(0);') {
        ctaLink = document.createElement('a');
        ctaLink.href = a.href;
        ctaLink.textContent = ctaText;
        contentCell.push(ctaLink);
      } else if (ctaText) {
        const p = document.createElement('p');
        p.textContent = ctaText;
        contentCell.push(p);
      }
    }
    // Defensive: If no content, add all text from anchor
    if (contentCell.length === 0) {
      const allText = getText(a);
      if (allText) {
        const p = document.createElement('p');
        p.textContent = allText;
        contentCell.push(p);
      } else {
        contentCell.push('');
      }
    }
    rows.push([iconCell, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
