/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns47)'];

  // Find the flex container holding the cards
  let cardsContainer = null;
  const gridLayouts = element.querySelectorAll('[automation-testid="flora-GridLayout"]');
  for (const grid of gridLayouts) {
    const flex = grid.querySelector('[aria-label="flex-container"]');
    if (flex) {
      cardsContainer = flex;
      break;
    }
  }
  if (!cardsContainer) {
    cardsContainer = element;
  }

  // Get all card sections (each is a column)
  const cardSections = Array.from(cardsContainer.querySelectorAll('section[automation-testid="flora-FlashCard"]'));
  if (cardSections.length === 0) {
    cardSections.push(...cardsContainer.querySelectorAll(':scope > div'));
  }

  // For each card, extract all direct children as cell content (to ensure all text is included)
  const columnCells = cardSections.map((card) => {
    // Instead of targeting specific selectors, grab all direct children
    const cellContent = [];
    Array.from(card.children).forEach(child => {
      // If child has children, include its subtree
      cellContent.push(child);
    });
    // Defensive: If nothing found, use the card itself
    if (cellContent.length === 0) {
      cellContent.push(card);
    }
    return cellContent;
  });

  // Build the table: header row, then one row with N columns
  const tableCells = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element
  element.replaceWith(block);
}
