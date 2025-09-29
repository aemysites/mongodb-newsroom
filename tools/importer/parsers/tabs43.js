/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Tabs (tabs43)'];
  const rows = [headerRow];

  // Get all immediate tab button children
  const tabButtons = element.querySelectorAll(':scope > button');

  tabButtons.forEach((btn) => {
    // Tab Label: use logo image and full text content as label
    let tabLabel = '';
    const img = btn.querySelector('img');
    // Get all text content inside the button (including alt text if present)
    let textContent = btn.textContent.trim();
    if (img) {
      // Compose label: alt text plus any text nodes
      tabLabel = img.alt ? img.alt.trim() : '';
      // If there is additional text (not in alt), append it
      if (textContent && !tabLabel.includes(textContent)) {
        tabLabel = tabLabel ? `${tabLabel} ${textContent}` : textContent;
      }
    } else {
      tabLabel = textContent;
    }
    // Tab Content: use the image itself as the content (if present)
    let tabContent = '';
    if (img) {
      tabContent = img.cloneNode(true);
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
