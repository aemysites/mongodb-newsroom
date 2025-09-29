/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children with a selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Header row as per spec
  const rows = [
    ['Accordion (accordion18)']
  ];

  // Each accordion item is a div with automation-testid="bonsai-Accordions-Tab"
  const accordionItems = element.querySelectorAll('[automation-testid="bonsai-Accordions-Tab"]');

  accordionItems.forEach(item => {
    // Title: <button> contains <h3> (the label)
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

    // Content: the next sibling div after button (with role="region")
    let contentRegion = null;
    // The structure is: item > button + div[role=region]
    const children = Array.from(item.children);
    for (let i = 0; i < children.length; i++) {
      if (children[i] === button && children[i + 1] && children[i + 1].getAttribute('role') === 'region') {
        contentRegion = children[i + 1];
        break;
      }
    }
    // Defensive: fallback to any div[role=region] inside item
    if (!contentRegion) {
      contentRegion = item.querySelector('div[role="region"]');
    }
    // The actual content is inside contentRegion > div > span
    let contentCell = null;
    if (contentRegion) {
      // Find the first <span> inside contentRegion
      const span = contentRegion.querySelector('span');
      if (span) {
        contentCell = span;
      } else {
        // Fallback: use all children of contentRegion
        contentCell = document.createElement('div');
        Array.from(contentRegion.childNodes).forEach(n => contentCell.appendChild(n.cloneNode(true)));
      }
    } else {
      // Fallback: empty cell
      contentCell = document.createElement('span');
    }

    rows.push([
      titleEl,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
