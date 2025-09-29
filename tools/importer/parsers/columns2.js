/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: expect two main columns
  let leftCol = null;
  let rightCol = null;
  if (children.length >= 2) {
    leftCol = children[0];
    rightCol = children[1];
  } else {
    // fallback: treat all as leftCol
    leftCol = element;
  }

  // --- LEFT COLUMN ---
  // Find heading, description, CTA from leftCol
  let heading = leftCol.querySelector('h2');
  let desc = leftCol.querySelector('div.mb-inc50, div.mb-inc50, div.mb-inc40, div.font-body');
  // fallback for description
  if (!desc) {
    desc = leftCol.querySelector('div');
  }
  let cta = leftCol.querySelector('a[href]');

  // Compose left column cell
  const leftCellContent = [];
  if (heading) leftCellContent.push(heading);
  if (desc) leftCellContent.push(desc);
  if (cta) leftCellContent.push(cta);

  // --- RIGHT COLUMN ---
  // Find "START FOR FREE:" label and list
  let startLabel = null;
  let ul = null;
  if (rightCol) {
    startLabel = rightCol.querySelector('span[automation-testid="flora-TypographyScale"]');
    ul = rightCol.querySelector('ul');
  }
  // Compose right column cell
  const rightCellContent = [];
  if (startLabel) rightCellContent.push(startLabel);
  if (ul) rightCellContent.push(ul);

  // --- TABLE ASSEMBLY ---
  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
