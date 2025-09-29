/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container that holds the two columns
  const grid = element.querySelector('[class*="grid"][class*="cols"]');
  if (!grid) return;

  // Get the two main columns (left: text, right: image)
  const gridChildren = Array.from(grid.children);
  if (gridChildren.length < 2) return;

  // LEFT COLUMN: gather all content (heading and paragraph)
  const leftCol = gridChildren[0];
  const leftContent = document.createElement('div');
  Array.from(leftCol.childNodes).forEach(node => {
    leftContent.appendChild(node.cloneNode(true));
  });

  // RIGHT COLUMN: find the image (reference, do not clone)
  const rightCol = gridChildren[1];
  let img = rightCol.querySelector('img');
  let rightContent;
  if (img) {
    rightContent = img;
  } else {
    // fallback: use the whole right column if no image
    rightContent = document.createElement('div');
    Array.from(rightCol.childNodes).forEach(node => {
      rightContent.appendChild(node.cloneNode(true));
    });
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns11)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
