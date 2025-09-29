/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block in the source HTML
  const hero = element.querySelector('[automation-testid="bonsai-Hero"]');
  if (!hero) return;

  // --- 1. Table Header ---
  const headerRow = ['Hero (hero17)'];

  // --- 2. Background Image Row ---
  let backgroundImg = null;
  const imgWrapper = hero.querySelector('[automation-testid="flora-SingleImage-Ratio"]');
  if (imgWrapper) {
    backgroundImg = imgWrapper.querySelector('img');
  }
  if (!backgroundImg) {
    backgroundImg = hero.querySelector('img');
  }
  const imageRow = [backgroundImg ? backgroundImg : ''];

  // --- 3. Content Row ---
  // Collect all text content from the hero block for maximum flexibility
  // Instead of only headings/paragraphs/cta, grab all direct children that contain text or links
  const contentElements = [];
  // Get all direct children of the main grid layout inside the hero
  const grid = hero.querySelector('[automation-testid="flora-GridLayout"]');
  if (grid) {
    // Get all direct children divs (which contain text blocks)
    Array.from(grid.children).forEach(child => {
      // Only include elements that have text content or contain links
      if (child.textContent.trim() || child.querySelector('a')) {
        contentElements.push(child.cloneNode(true));
      }
    });
  } else {
    // fallback: get all text-containing elements in hero
    hero.querySelectorAll('h1, h2, h3, p, a').forEach(el => {
      if (el.textContent.trim()) contentElements.push(el.cloneNode(true));
    });
  }
  const contentRow = [contentElements.length ? contentElements : ['']];

  // --- 4. Create Table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- 5. Replace original element ---
  element.replaceWith(block);
}
