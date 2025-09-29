/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children of type
  function getDirectChildrenByTag(parent, tagName) {
    return Array.from(parent.children).filter(child => child.tagName === tagName);
  }

  // Table header
  const headerRow = ['Accordion (accordion6)'];

  // Defensive: find the button with the title
  const button = element.querySelector('button');
  let titleCell;
  if (button) {
    // The h3 inside button is the title
    const h3 = button.querySelector('h3');
    if (h3) {
      titleCell = h3;
    } else {
      // fallback: use button text
      titleCell = document.createElement('span');
      titleCell.textContent = button.textContent.trim();
    }
  } else {
    // fallback: use first heading
    const h3 = element.querySelector('h3');
    if (h3) {
      titleCell = h3;
    } else {
      // fallback: use first child text
      titleCell = document.createElement('span');
      titleCell.textContent = element.textContent.trim();
    }
  }

  // Defensive: find the content cell
  let contentCell;
  // The content is inside the div with role="region"
  const contentRegion = element.querySelector('div[role="region"]');
  if (contentRegion) {
    // Use the whole region div as content cell
    contentCell = contentRegion;
  } else {
    // fallback: use all divs except button
    const divs = getDirectChildrenByTag(element, 'DIV').filter(div => div !== button);
    if (divs.length) {
      contentCell = document.createElement('div');
      divs.forEach(div => contentCell.appendChild(div));
    } else {
      // fallback: empty cell
      contentCell = document.createElement('div');
    }
  }

  // Compose rows
  const rows = [headerRow, [titleCell, contentCell]];

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element
  element.replaceWith(table);
}
