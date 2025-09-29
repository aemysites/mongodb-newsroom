/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // --- 1. HEADER ROW ---
  const headerRow = ['Columns (columns69)'];

  // --- 2. COLUMNS ROW ---
  // Always output two columns for this layout

  // Find the left column content
  const leftColWrapper = getChildByClass(element, 'css-1nla2wl');
  const leftCol = leftColWrapper || element;

  // Announcement bar (NEW + text + link)
  const announcement = leftCol.querySelector('.css-1c7jan4');
  // Main heading
  const heading = leftCol.querySelector('h1');
  // Subheading
  const subheading = leftCol.querySelector('.css-hx8boc');

  // Compose left column content (all referenced, not cloned)
  const leftColContent = [];
  if (announcement) leftColContent.push(announcement);
  if (heading) leftColContent.push(heading);
  if (subheading) leftColContent.push(subheading);

  // Find the right column content (image)
  const rightColWrapper = getChildByClass(element, 'css-1q7qhor');
  let image = null;
  if (rightColWrapper) {
    const imageWrapper = rightColWrapper.querySelector('.css-1fci34v');
    if (imageWrapper) {
      image = imageWrapper.querySelector('img');
    }
  }

  // Compose columns row: always two columns, fill empty with empty string if needed
  const columnsRow = [
    leftColContent.length ? leftColContent : '',
    image ? [image] : ''
  ];

  // --- BUILD TABLE ---
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
