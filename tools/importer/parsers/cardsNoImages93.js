/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a card cell from a card root element
  function createCardCell(cardEl) {
    // Defensive: get children by tag, not class
    const children = Array.from(cardEl.children);
    let dateEl = null;
    let headingEl = null;
    let descEl = null;
    let tagsEl = null;
    // Find elements by tag
    for (const child of children) {
      if (child.tagName === 'P' && !dateEl) {
        dateEl = child;
      } else if (child.tagName === 'H3') {
        headingEl = child;
      } else if (child.tagName === 'P' && dateEl) {
        descEl = child;
      } else if (child.tagName === 'DIV') {
        tagsEl = child;
      }
    }
    // Compose content for the card cell
    const cellContent = [];
    if (dateEl) cellContent.push(dateEl);
    if (headingEl) cellContent.push(headingEl);
    if (descEl) cellContent.push(descEl);
    if (tagsEl && tagsEl.children.length > 0) {
      // Put tags in a <div> for grouping
      cellContent.push(tagsEl);
    }
    return [cellContent]; // Single cell row
  }

  // Find all card elements (direct children with data-testid="featured-update")
  const cardEls = Array.from(element.querySelectorAll(':scope > .leafygreen-ui-1kjtvea[data-testid="featured-update"]'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cardsNoImages93)'];
  rows.push(headerRow);

  // Each card becomes a row
  cardEls.forEach(cardEl => {
    rows.push(createCardCell(cardEl));
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
