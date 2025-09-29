/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns14)'];

  // Find the main grid layout
  const grid = element.querySelector('[automation-testid="flora-GridLayout"]');
  if (!grid) return;

  // ---
  // LEFT COLUMN: Title, description, links
  // ---
  const leftColDiv = grid.children[0];
  let leftColContent = document.createElement('div');
  if (leftColDiv) {
    // Title (h2)
    const h2 = leftColDiv.querySelector('h2');
    if (h2) leftColContent.appendChild(h2.cloneNode(true));
    // Description (span)
    const desc = leftColDiv.querySelector('span[automation-testid="flora-TypographyScale"]');
    if (desc) leftColContent.appendChild(desc.cloneNode(true));
    // Desktop link (right side, but visually grouped)
    const desktopLink = leftColDiv.querySelector('a[href]');
    if (desktopLink) leftColContent.appendChild(desktopLink.cloneNode(true));
    // Mobile link (in a separate div)
    const mobileLinkDiv = leftColDiv.querySelector('div[data-testid="linkelement"]');
    if (mobileLinkDiv) {
      const mobileLink = mobileLinkDiv.querySelector('a[href]');
      if (mobileLink) leftColContent.appendChild(mobileLink.cloneNode(true));
    }
  }
  if (!leftColContent.hasChildNodes()) leftColContent = '';

  // ---
  // MIDDLE COLUMN: Accordion (Deploy a database)
  // ---
  let accordionPanel = null;
  for (const child of grid.children) {
    if (child.getAttribute('automation-testid') === 'bonsai-CodeSnippetV2-AccordionPanel') {
      accordionPanel = child;
      break;
    }
  }
  let middleColContent = document.createElement('div');
  if (accordionPanel) {
    // Find all accordions (desktop and mobile)
    const accordions = accordionPanel.querySelectorAll('[automation-testid="flora-Accordion"]');
    accordions.forEach(acc => {
      middleColContent.appendChild(acc.cloneNode(true));
    });
  }
  if (!middleColContent.hasChildNodes()) middleColContent = '';

  // ---
  // RIGHT COLUMN: Code panel (desktop only)
  // ---
  let rightColContent = document.createElement('div');
  let foundRight = false;
  for (const child of grid.children) {
    if (child.classList.contains('col-span-7')) {
      // This is the code panel column
      rightColContent.appendChild(child.cloneNode(true));
      foundRight = true;
      break;
    }
  }
  // If no right column, but there is a code panel inside the accordion (mobile), use that
  if (!foundRight && accordionPanel) {
    const codePanels = accordionPanel.querySelectorAll('[automation-testid="flora-CodePanel"]');
    codePanels.forEach(cp => {
      rightColContent.appendChild(cp.cloneNode(true));
    });
  }
  if (!rightColContent.hasChildNodes()) rightColContent = '';

  // Compose the columns row
  const columnsRow = [leftColContent, middleColContent, rightColContent].filter(col => col !== '');

  // Compose the table rows
  const rows = [headerRow, columnsRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
