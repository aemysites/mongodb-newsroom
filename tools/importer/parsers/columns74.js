/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate FlashCard sections (each is a column)
  const cardSections = Array.from(
    element.querySelectorAll(':scope div[automation-testid="bonsai-VerticalSectionSpacing"] div[automation-testid="flora-GridLayout"] div[aria-label="flex-container"] > section[automation-testid="flora-FlashCard"]')
  );

  // Defensive: If not found, fallback to all direct sections
  const columns = cardSections.length > 0 ? cardSections : Array.from(
    element.querySelectorAll(':scope section[automation-testid="flora-FlashCard"]')
  );

  // Each column: use the entire FlashCard section (icon, heading, text)
  const secondRow = columns.map(section => section);

  // Table rows: header, columns
  const headerRow = ['Columns (columns74)'];
  const tableRows = [headerRow, secondRow];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
