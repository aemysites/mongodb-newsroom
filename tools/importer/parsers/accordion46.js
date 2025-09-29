/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the block element
  function extractAccordionItem(el) {
    const button = el.querySelector('button');
    let title = null;
    if (button) {
      title = button.querySelector('h3') || button;
    }
    const content = el.querySelector('[role="region"]');
    // Remove empty paragraphs from content
    if (content) {
      content.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim()) p.remove();
      });
    }
    return [title, content];
  }

  // Build header row with exactly one column (block name only)
  const headerRow = ['Accordion (accordion46)'];
  const rows = [headerRow];

  let accordionItems = [];
  if (element.matches('[automation-testid="bonsai-Accordions-Tab"]')) {
    accordionItems = [element];
  } else {
    accordionItems = Array.from(
      element.querySelectorAll(':scope > [automation-testid="bonsai-Accordions-Tab"]')
    );
    if (accordionItems.length === 0) {
      accordionItems = Array.from(element.children);
    }
  }

  accordionItems.forEach((item) => {
    const [title, content] = extractAccordionItem(item);
    if (title && content) {
      rows.push([title, content]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Ensure header row has exactly one column (no colspan)
  const headerTr = block.querySelector('tr');
  if (headerTr && headerTr.children.length > 1) {
    // Remove extra header cells if present
    while (headerTr.children.length > 1) {
      headerTr.removeChild(headerTr.lastChild);
    }
    // Remove colspan if present
    if (headerTr.firstChild.hasAttribute('colspan')) {
      headerTr.firstChild.removeAttribute('colspan');
    }
  }
  // Replace the original element
  element.replaceWith(block);
}
