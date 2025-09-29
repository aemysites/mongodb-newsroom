/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion25)'];
  const rows = [headerRow];

  // Find the main container for accordion items
  // Defensive: skip background wrappers, find the content container
  let contentContainer = element.querySelector('.w-full.w-max-770, .w-full.w-max-770.m-auto');
  if (!contentContainer) {
    // fallback: find the first container with Details__Container-sc-wfooue-0
    contentContainer = element;
  }

  // Select all accordion item containers (each Details__Container-sc-wfooue-0)
  const accordionItems = contentContainer.querySelectorAll('.Details__Container-sc-wfooue-0');

  accordionItems.forEach((item) => {
    // Title: first h3 inside .fl-1
    const fl1 = item.querySelector('.fl-1');
    let title = null;
    if (fl1) {
      title = fl1.querySelector('h3');
    }
    // Defensive: fallback to first h3
    if (!title) {
      title = item.querySelector('h3');
    }
    // Content: the content div inside .overflow-hidden
    let content = null;
    const overflowHidden = item.querySelector('.overflow-hidden');
    if (overflowHidden) {
      // The actual content is usually a .m-0.p-b-30.dark-gray.fl.fl-wrap > div
      const contentWrap = overflowHidden.querySelector('.m-0.p-b-30.dark-gray.fl.fl-wrap > div');
      if (contentWrap) {
        content = contentWrap;
      } else {
        // fallback: use all children of overflowHidden
        content = document.createElement('div');
        Array.from(overflowHidden.childNodes).forEach((n) => content.appendChild(n.cloneNode(true)));
      }
    }
    // Defensive: if no content, leave cell empty
    rows.push([
      title ? title : '',
      content ? content : '',
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
