/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections
  const cardSections = element.querySelectorAll('section.css-9m4xdg');

  // Table header (must match target block name exactly)
  const headerRow = ['Cards (cards64)'];
  const rows = [headerRow];

  cardSections.forEach((section) => {
    // Image: always present in card-header span
    const img = section.querySelector('.css-180x1vp img');
    let imageEl = null;
    if (img) {
      imageEl = img.cloneNode(true);
      if (!imageEl.src && imageEl.getAttribute('data-src')) {
        imageEl.src = imageEl.getAttribute('data-src');
      }
    }

    // Text content: title (h3) and description (p)
    const title = section.querySelector('h3');
    const desc = section.querySelector('p');
    const textEls = [];
    if (title) textEls.push(title.cloneNode(true));
    if (desc) textEls.push(desc.cloneNode(true));

    // Defensive: skip if no image or text
    if (!imageEl && textEls.length === 0) return;
    rows.push([imageEl, textEls]);
  });

  // Only replace if there are card rows
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
