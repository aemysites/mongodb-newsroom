/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate FlashCard sections (these are the columns)
  const cardSections = Array.from(
    element.querySelectorAll(':scope div[automation-testid="bonsai-VerticalSectionSpacing"] div[automation-testid="flora-GridLayout"] [aria-label="flex-container"] > section[automation-testid="flora-FlashCard"]')
  );

  // Defensive: If no cards found, do nothing
  if (!cardSections.length) return;

  // Header row as specified
  const headerRow = ['Columns (columns70)'];

  // Second row: each card becomes a column
  // We use the entire section element for each cell
  const columnsRow = cardSections.map((section) => section);

  // Table structure: header, then columns
  const tableCells = [headerRow, columnsRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
