/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns45)'];

  // Find the two columns: the first and second direct child divs
  const rowDivs = Array.from(element.querySelectorAll(':scope > div > div'));
  // Defensive: fallback to just direct children if above doesn't work
  const columns = rowDivs.length > 0 ? rowDivs : Array.from(element.children);

  // Each column gets its own cell
  const contentRow = columns.map((col) => col);

  const tableRows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
