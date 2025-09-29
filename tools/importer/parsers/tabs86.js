/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all tabs from a given container
  function extractTabs(container) {
    const tabs = [];
    // Each tab is a .css-1lmik55 or .css-1tizk0h (accordion-wrapper)
    const tabWrappers = container.querySelectorAll('[aria-label="accordion-wrapper"]');
    tabWrappers.forEach((tabWrapper) => {
      // Tab label
      const tabHead = tabWrapper.querySelector('[aria-label="accordion-tab-head"]');
      let tabLabel = '';
      if (tabHead) {
        const h6 = tabHead.querySelector('h6');
        if (h6) tabLabel = h6.textContent.trim();
      }
      // Tab content
      const tabBody = tabWrapper.querySelector('[aria-label*="tab-body"]');
      let tabContent = '';
      if (tabBody) {
        // Instead of just children, get all textContent and inline elements
        // Clone tabBody and remove any code panel wrappers (if any)
        const tabBodyClone = tabBody.cloneNode(true);
        // Remove code panel wrappers (if present)
        tabBodyClone.querySelectorAll('.css-14byl6h, [aria-label="code-panel-wrapper"]').forEach(el => el.remove());
        // Get all content as HTML string (including inline links, etc.)
        tabContent = tabBodyClone.innerHTML.trim();
        // If empty, fallback to textContent
        if (!tabContent) tabContent = tabBodyClone.textContent.trim();
      }
      tabs.push({ label: tabLabel, content: tabContent });
    });
    return tabs;
  }

  // Find all tab containers (there may be several)
  // The main tab containers are .css-916hyp and .css-ydim13
  const tabContainers = [];
  const mainContainers = element.querySelectorAll('.css-916hyp, .css-ydim13');
  mainContainers.forEach((container) => {
    tabContainers.push(container);
  });

  // Collect all tabs from all containers
  let allTabs = [];
  tabContainers.forEach((container) => {
    const tabs = extractTabs(container);
    allTabs = allTabs.concat(tabs);
  });

  // Defensive: Remove duplicate tabs by label (sometimes repeated)
  const seenLabels = new Set();
  allTabs = allTabs.filter(tab => {
    if (seenLabels.has(tab.label)) return false;
    seenLabels.add(tab.label);
    return true;
  });

  // Table header row
  const headerRow = ['Tabs (tabs86)'];
  const rows = [headerRow];

  // For each tab, add [label, content] row
  allTabs.forEach(tab => {
    // Defensive: If tab content is empty, skip
    if (!tab.label || !tab.content) return;
    // Create a div to hold the HTML content
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = tab.content;
    rows.push([
      tab.label,
      contentDiv
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
