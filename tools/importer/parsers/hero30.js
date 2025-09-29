/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero30)'];

  // 2. Find the hero image (background image)
  let heroImg = null;
  const imgs = element.querySelectorAll('img');
  for (const img of imgs) {
    if (img.width >= 400 && img.height >= 300) {
      heroImg = img;
      break;
    }
  }
  if (!heroImg && imgs.length > 0) heroImg = imgs[0];
  const imageRow = [heroImg || ''];

  // 3. Gather all text content for the hero (be flexible)
  // Find the first <h1> for headline
  const headline = element.querySelector('h1');

  // Find the intro block for subheading, paragraph, CTA
  const intro = element.querySelector('.introduction');
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (intro) {
    // Add all paragraphs in intro
    intro.querySelectorAll('p').forEach(p => contentCell.push(p));
    // Add all CTA buttons/links in intro
    intro.querySelectorAll('a').forEach(a => contentCell.push(a));
  }

  // If there is any other text node directly under the section, add it
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      contentCell.push(p);
    }
  });

  // 4. Table rows
  const rows = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
