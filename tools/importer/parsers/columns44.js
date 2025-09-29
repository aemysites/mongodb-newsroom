/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate section children (each column)
  const sections = element.querySelectorAll(':scope section');

  // Each column cell will be built from its respective section
  const columnCells = [];
  sections.forEach((section) => {
    // Get all direct children of the section's inner div
    const innerDiv = section.querySelector('div');
    let cellContent = [];
    if (innerDiv) {
      // Get all spans (for percent and description)
      const spans = section.querySelectorAll('span');
      spans.forEach((span) => {
        // If span contains an image and alt, add bold text and image
        const img = span.querySelector('img');
        if (img && img.getAttribute('alt')) {
          const strong = document.createElement('strong');
          strong.textContent = img.getAttribute('alt');
          cellContent.push(strong);
          cellContent.push(img);
        } else if (span.textContent.trim()) {
          // Add any text content
          cellContent.push(span.cloneNode(true));
        }
      });
      // If no spans, fallback to all text in section
      if (cellContent.length === 0) {
        cellContent.push(document.createTextNode(section.textContent.trim()));
      }
    } else {
      // Fallback: just use section text
      cellContent.push(document.createTextNode(section.textContent.trim()));
    }
    columnCells.push(cellContent);
  });

  // Build table rows
  const headerRow = ['Columns (columns44)'];
  const tableRows = [headerRow, columnCells];

  // Create block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(blockTable);
}
