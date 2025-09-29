/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row
  const headerRow = ['Columns (columns35)'];

  // Defensive: Get all immediate child divs (each contains a logo image)
  const logoDivs = Array.from(element.querySelectorAll(':scope > div'));

  // For each logo div, extract the image element (should be only one per div)
  const logoImages = logoDivs.map(div => {
    const img = div.querySelector('img');
    return img ? img : '';
  });

  // The second row is the columns row: one column per logo
  const columnsRow = logoImages;

  // Compose the table data
  const tableData = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
