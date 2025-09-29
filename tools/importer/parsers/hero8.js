/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct children by selector
  function findDirectChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Hero (hero8)'];

  // 2. Background image row
  let imageEl = null;
  // Find the image inside the hero block
  const section = element.querySelector('section');
  if (section) {
    // Find all img elements within section
    const imgs = section.querySelectorAll('img');
    if (imgs.length > 0) {
      imageEl = imgs[0];
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: Title, Subheading, CTA
  // We'll collect all relevant text and CTA elements
  let contentEls = [];
  if (section) {
    // Find the main grid container
    const grid = section.querySelector('[automation-testid="flora-GridLayout"]');
    if (grid) {
      // Find all direct children of grid
      const gridChildren = Array.from(grid.children);
      // Eyebrow/mark
      const eyebrowDiv = gridChildren.find(div => div.querySelector('mark'));
      if (eyebrowDiv) {
        const mark = eyebrowDiv.querySelector('mark');
        if (mark) contentEls.push(mark);
      }
      // Heading
      const headingDiv = gridChildren.find(div => div.querySelector('h1'));
      if (headingDiv) {
        const h1 = headingDiv.querySelector('h1');
        if (h1) contentEls.push(h1);
      }
      // Subheading/description
      const descDiv = gridChildren.find(div => div.querySelector('[data-testid="hero-description-wrapper"]'));
      if (descDiv) {
        const desc = descDiv.querySelector('[data-testid="hero-description-wrapper"]');
        if (desc) contentEls.push(desc);
      }
      // CTA
      const ctaDiv = gridChildren.find(div => div.querySelector('[data-testid="hero-cta-wrapper"]'));
      if (ctaDiv) {
        const ctaWrapper = ctaDiv.querySelector('[data-testid="hero-cta-wrapper"]');
        if (ctaWrapper) {
          // Find the actual CTA link
          const ctaLink = ctaWrapper.querySelector('a');
          if (ctaLink) contentEls.push(ctaLink);
        } else {
          // Fallback: look for any link in ctaDiv
          const ctaLink = ctaDiv.querySelector('a');
          if (ctaLink) contentEls.push(ctaLink);
        }
      }
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
