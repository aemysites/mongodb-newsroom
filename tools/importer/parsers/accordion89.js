/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct accordion items
  const accordionItems = Array.from(
    element.querySelectorAll(':scope > .grid > [automation-testid="bonsai-Accordions-Tab"]')
  );

  // Table header row
  const headerRow = ['Accordion (accordion89)'];
  const rows = [headerRow];

  accordionItems.forEach((item) => {
    // Title cell: get the h3 inside the button
    const button = item.querySelector('button');
    let title = null;
    if (button) {
      title = button.querySelector('h3');
    }
    // Defensive fallback: if no h3, use button text
    if (!title && button) {
      title = document.createElement('span');
      title.textContent = button.textContent.trim();
    }

    // Content cell: get the region div
    const contentRegion = item.querySelector('[role="region"]');
    let contentCell = null;
    if (contentRegion) {
      // Use the entire content region as the cell
      contentCell = contentRegion;
    } else {
      // Defensive fallback: empty cell
      contentCell = document.createElement('div');
    }

    rows.push([title, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
