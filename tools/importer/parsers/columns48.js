/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children matching selector
  function getChildrenBySelector(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the main section containing the columns
  const htmlBlock = element.querySelector('.pf-html-block');
  if (!htmlBlock) return;

  const section = htmlBlock.querySelector('section');
  if (!section) return;

  // The layout is: left (main card), right (list of links)
  // Get the two main column containers
  const gridChildren = getChildrenBySelector(section, 'div');
  if (gridChildren.length < 2) return;

  // Left column: main card (title, summary, button, image)
  const leftCol = gridChildren[0];
  // Right column: vertical stack of links
  const rightCol = gridChildren[1];

  // --- Left Column ---
  // The left column contains two children: text/button and image
  const leftColChildren = getChildrenBySelector(leftCol, 'div');
  let leftTextBlock = null;
  let leftImageBlock = null;
  if (leftColChildren.length === 2) {
    leftTextBlock = leftColChildren[0];
    leftImageBlock = leftColChildren[1];
  } else {
    // Defensive fallback: find image and text
    leftImageBlock = leftCol.querySelector('img');
    leftTextBlock = leftCol.querySelector('div');
  }

  // Compose left column cell
  const leftCellContent = [];
  if (leftTextBlock) leftCellContent.push(leftTextBlock);
  if (leftImageBlock) leftCellContent.push(leftImageBlock);

  // --- Right Column ---
  // The right column contains a stack of <a> blocks
  const rightLinks = getChildrenBySelector(rightCol, 'a');
  // Compose right column cell
  const rightCellContent = rightLinks.length > 0 ? rightLinks : [rightCol];

  // --- Table Construction ---
  const headerRow = ['Columns (columns48)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
