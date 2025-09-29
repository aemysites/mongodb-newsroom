/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a section
  function extractCard(section) {
    // Title
    const titleDiv = section.querySelector('.css-1ld731p h5');
    let title = '';
    if (titleDiv) {
      title = titleDiv.textContent.trim();
    }
    // Description
    const descSpan = section.querySelector('.css-1xkqypz span');
    let desc = '';
    if (descSpan) {
      desc = descSpan.textContent.trim();
    }
    // CTA(s)
    const ctaContainer = section.querySelector('.css-u3jsv5');
    let ctas = [];
    if (ctaContainer) {
      // Find all links inside the ctaContainer
      const links = ctaContainer.querySelectorAll('a');
      links.forEach((link) => {
        // Compose CTA: icon + label as a link
        const ctaEl = document.createElement('div');
        ctaEl.style.display = 'flex';
        ctaEl.style.alignItems = 'center';
        // Icon
        const icon = link.querySelector('img');
        if (icon) {
          ctaEl.appendChild(icon);
        }
        // Label
        const labelSpan = link.querySelector('.css-ulkukj');
        if (labelSpan) {
          const labelLink = document.createElement('a');
          labelLink.href = link.href;
          labelLink.textContent = labelSpan.textContent.trim();
          labelLink.style.marginLeft = icon ? '8px' : '0';
          ctaEl.appendChild(labelLink);
        }
        ctas.push(ctaEl);
      });
    }
    // Compose text cell: title (heading), description, CTAs
    const textCell = document.createElement('div');
    if (title) {
      const heading = document.createElement('h5');
      heading.textContent = title;
      textCell.appendChild(heading);
    }
    if (desc) {
      const descP = document.createElement('p');
      descP.textContent = desc;
      textCell.appendChild(descP);
    }
    if (ctas.length) {
      const ctaWrapper = document.createElement('div');
      ctas.forEach((cta) => ctaWrapper.appendChild(cta));
      textCell.appendChild(ctaWrapper);
    }
    // Image cell: find the corresponding image for this section
    // Images are in the diamond blocks, in order
    return textCell;
  }

  // Get all card sections
  const cardSections = Array.from(element.querySelectorAll('.section.css-mq62wi'));
  // Get all diamond images (in visual order)
  const diamondContainer = element.querySelector('#diamonds-container');
  let diamondImages = [];
  if (diamondContainer) {
    diamondImages = Array.from(diamondContainer.querySelectorAll('.diamond .css-zrc6a9 img'));
    // If not visible, fallback to all images in diamondContainer
    if (!diamondImages.length) {
      diamondImages = Array.from(diamondContainer.querySelectorAll('img'));
    }
  }
  // Defensive: fallback to all images in the block
  if (!diamondImages.length) {
    diamondImages = Array.from(element.querySelectorAll('img'));
  }

  // Compose table rows
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];
  cardSections.forEach((section, idx) => {
    // Image cell
    let imgEl = diamondImages[idx];
    if (!imgEl) {
      // Fallback: try to find first image in section
      imgEl = section.querySelector('img');
    }
    // Defensive: if no image, use empty div
    const imageCell = imgEl || document.createElement('div');
    // Text cell
    const textCell = extractCard(section);
    rows.push([imageCell, textCell]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
