/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Hero (hero16)'];

  // Defensive: Find the background image container (first child div)
  const bgImgContainer = element.querySelector(':scope > div');
  let bgImgs = [];
  if (bgImgContainer) {
    // Find all img elements inside (mobile/tablet/desktop variants)
    bgImgs = Array.from(bgImgContainer.querySelectorAll('img'));
  }

  // For the background image row, just use all the images in the container
  // (let downstream rendering pick the right one)
  const bgImgRow = [bgImgs];

  // Content row: find the content container (second child div)
  const contentContainer = element.querySelector(':scope > div:nth-child(2)');
  let contentElements = [];
  if (contentContainer) {
    // Grab all children (e.g., h2, p, etc.)
    contentElements = Array.from(contentContainer.children);
  }
  const contentRow = [contentElements];

  // Compose table
  const tableCells = [
    headerRow,
    bgImgRow,
    contentRow,
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
