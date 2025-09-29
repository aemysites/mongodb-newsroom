/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct accordion items
  const accordionItems = Array.from(element.querySelectorAll(':scope > .grid > [automation-testid="bonsai-Accordions-Tab"]'));

  // Table header row
  const headerRow = ['Accordion (accordion53)'];
  const rows = [headerRow];

  accordionItems.forEach((item) => {
    // Title: <button> contains <h3>
    const button = item.querySelector('button');
    let titleEl = null;
    if (button) {
      titleEl = button.querySelector('h3');
      // Defensive: fallback to button text if h3 missing
      if (!titleEl) {
        titleEl = document.createElement('span');
        titleEl.textContent = button.textContent.trim();
      }
    }

    // Content: <div role="region"> contains all body content
    const contentRegion = item.querySelector('div[role="region"]');
    let contentEl = null;
    if (contentRegion) {
      // Defensive: grab the first child (usually <div>), or fallback to contentRegion itself
      const inner = contentRegion.querySelector(':scope > div');
      if (inner) {
        contentEl = inner;
      } else {
        contentEl = contentRegion;
      }
    }

    // Add row: [title, content]
    rows.push([titleEl, contentEl]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
