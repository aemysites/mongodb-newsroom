/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get direct children of a given element
  function getDirectChildrenBySelector(parent, selector) {
    return Array.from(parent.querySelectorAll(`:scope > ${selector}`));
  }

  // 1. Header row
  const headerRow = ['Columns (columns61)'];

  // 2. Collect content for columns
  // Defensive: find the main content wrapper
  let mainWrapper = element;
  while (mainWrapper.children.length === 1) {
    mainWrapper = mainWrapper.children[0];
  }

  // Find the label/span
  const labelSpan = mainWrapper.querySelector('span');

  // Find the logo container (the div that contains the logo divs)
  let logoRow = null;
  // Try to find the first div after the labelSpan
  if (labelSpan) {
    let next = labelSpan.nextElementSibling;
    while (next && next.tagName !== 'DIV') {
      next = next.nextElementSibling;
    }
    logoRow = next;
  }
  if (!logoRow) {
    // fallback: find the first div with images
    logoRow = Array.from(mainWrapper.querySelectorAll('div')).find(div => div.querySelector('img'));
  }

  let logoDivs = [];
  if (logoRow) {
    logoDivs = getDirectChildrenBySelector(logoRow, 'div');
  }

  // Defensive: if logoDivs is empty, try to find all images
  if (logoDivs.length === 0 && logoRow) {
    logoDivs = Array.from(logoRow.querySelectorAll('img')).map(img => {
      const div = document.createElement('div');
      div.appendChild(img);
      return div;
    });
  }

  // Compose the columns row: label in first cell, then each logo in its own cell
  const columnsRow = [labelSpan, ...logoDivs];

  // Compose table
  const cells = [headerRow, columnsRow];

  // Create table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
