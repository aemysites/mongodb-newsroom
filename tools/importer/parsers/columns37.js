/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <footer> element inside the container
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Get all direct children of the main footer flex container
  // This is the div with class leafygreen-ui-uxssyh
  const mainFlex = footer.querySelector('.leafygreen-ui-uxssyh');
  if (!mainFlex) return;

  // The first child is the logo/language/copyright column
  // The rest are the nav columns (About, Support, etc.)
  const columns = Array.from(mainFlex.children);

  // Defensive: Filter out empty or irrelevant columns
  const filteredColumns = columns.filter(col => {
    // Remove empty divs or copyright-only divs at the end
    if (col.children.length === 0) return false;
    // Remove copyright-only divs (these are repeated at the end)
    if (col.textContent && col.textContent.trim().match(/^©/)) return false;
    return true;
  });

  // Compose the columns for the block (each column is a cell)
  // Use the original elements directly for resilience
  const contentRow = filteredColumns.map(col => col);

  // Build the table rows
  const headerRow = ['Columns (columns37)'];
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
