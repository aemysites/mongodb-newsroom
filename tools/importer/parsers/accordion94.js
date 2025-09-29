/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion94)'];
  const rows = [headerRow];

  // Find all accordion items (assume each root div is one item)
  // Defensive: handle both single and multiple items
  let accordionItems = [];
  if (element.matches('[aria-label="accordion-wrapper"]')) {
    accordionItems = [element];
  } else {
    accordionItems = Array.from(element.querySelectorAll('[aria-label="accordion-wrapper"]'));
  }

  accordionItems.forEach(item => {
    // Title: find the tab head and get its text
    const tabHead = item.querySelector('[aria-label="accordion-tab-head"]');
    let title = '';
    if (tabHead) {
      // Prefer h6, fallback to all text
      const h6 = tabHead.querySelector('h6');
      title = h6 ? h6.textContent.trim() : tabHead.textContent.trim();
    }

    // Content: find the tab body and get all text content
    const tabBody = item.querySelector('[aria-label="accordion-tab-body"]');
    let content = '';
    if (tabBody) {
      // Get all text inside tabBody
      content = tabBody.textContent.trim();
    }

    // Only add row if both title and content exist
    if (title && content) {
      rows.push([title, content]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
