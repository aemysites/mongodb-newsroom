/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion26)'];
  const rows = [headerRow];

  // Each accordion item is a direct child <div> of the wrapper
  // Only process direct children that contain both head and body
  const accordionItems = Array.from(element.children).filter(child =>
    child.querySelector('[aria-label="accordion-tab-head"]') && child.querySelector('[aria-label="accordion-tab-body"]')
  );

  accordionItems.forEach(item => {
    const head = item.querySelector('[aria-label="accordion-tab-head"]');
    const body = item.querySelector('[aria-label="accordion-tab-body"]');
    if (!head || !body) return;

    // Title cell: prefer heading element, else fallback to all text content
    let titleCell = '';
    const heading = head.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading) {
      titleCell = heading.textContent.trim();
    } else {
      titleCell = head.textContent.trim();
    }

    // Content cell: include ALL text content from body, preserving line breaks
    let contentCell = '';
    // Get all block-level elements and join their text with line breaks
    const blocks = Array.from(body.querySelectorAll('p,ul,ol,div,section,article,blockquote,pre,table'));
    if (blocks.length > 0) {
      contentCell = blocks.map(el => el.textContent.trim()).filter(Boolean).join('\n');
    } else {
      contentCell = body.textContent.trim();
    }

    rows.push([titleCell, contentCell]);
  });

  // Always replace the element, even if no items found (table with only header)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
