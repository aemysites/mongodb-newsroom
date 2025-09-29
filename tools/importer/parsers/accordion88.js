/* global WebImporter */
export default function parse(element, { document }) {
  // Find FAQ heading
  const faqHeading = Array.from(element.querySelectorAll('h2')).find(h => h.textContent.trim().toLowerCase() === 'faq');
  if (!faqHeading) return;

  // Find all FAQ accordion tabs after the heading
  const accordionTabs = Array.from(element.querySelectorAll('[automation-testid="bonsai-Accordions-Tab"]'));
  if (!accordionTabs.length) return;

  // Build rows: header row is a single cell
  const rows = [['Accordion (accordion88)']];

  accordionTabs.forEach(tab => {
    // Title cell: button > h3
    let titleCell = '';
    const button = tab.querySelector('button');
    if (button) {
      const h3 = button.querySelector('h3');
      if (h3) {
        titleCell = h3.textContent.trim();
      } else {
        titleCell = button.textContent.trim();
      }
    }
    // Content cell: region > get only visible content (not empty, not duplicated)
    let contentCell = '';
    const region = tab.querySelector('[role="region"]');
    if (region) {
      // Find the first span with actual text content
      let answerSpan = Array.from(region.querySelectorAll('span')).find(s => s.textContent.trim());
      if (answerSpan) {
        contentCell = answerSpan.cloneNode(true);
      } else {
        // fallback: get all paragraphs with text
        let paragraphs = Array.from(region.querySelectorAll('p')).filter(p => p.textContent.trim());
        if (paragraphs.length) {
          const wrapper = document.createElement('div');
          paragraphs.forEach(p => wrapper.appendChild(p.cloneNode(true)));
          contentCell = wrapper;
        } else {
          // fallback: region itself
          contentCell = region.cloneNode(true);
        }
      }
    }
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Only replace if we have at least one row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
