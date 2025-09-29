/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid layout
  const grid = element.querySelector('[automation-testid="flora-GridLayout"]');
  if (!grid) return;

  // Find the left and right column containers
  // Left: contains heading, description, CTA
  // Right: contains image
  let leftCol, rightCol;
  const gridChildren = Array.from(grid.children);
  for (const div of gridChildren) {
    if (div.querySelector('h1') && div.querySelector('p')) {
      leftCol = div;
    }
    if (div.querySelector('img')) {
      rightCol = div;
    }
  }
  // Fallbacks if not found
  if (!leftCol) leftCol = gridChildren[0];
  if (!rightCol) rightCol = gridChildren[1];

  // Compose left column: heading, description, CTA
  const leftContent = [];
  const heading = leftCol.querySelector('h1');
  if (heading) leftContent.push(heading);
  const descWrapper = leftCol.querySelector('[data-testid="hero-description-wrapper"]');
  if (descWrapper) {
    // Get all paragraphs
    Array.from(descWrapper.querySelectorAll('p')).forEach(p => leftContent.push(p));
  }
  const cta = leftCol.querySelector('a');
  if (cta) leftContent.push(cta);

  // Compose right column: image
  const img = rightCol.querySelector('img');
  const rightContent = img ? [img] : [];

  // Build table
  const headerRow = ['Columns (columns63)'];
  const columnsRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
