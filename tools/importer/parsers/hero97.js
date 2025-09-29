/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct children divs
  const sectionDivs = element.querySelectorAll(':scope > div');
  // Defensive: Find the image (background asset)
  let imageEl = null;
  // Defensive: Find the content block (heading, subheading, CTA)
  let headingEl = null;
  let subheadingEl = null;
  let ctaEl = null;

  // Find the grid layout container
  let gridDiv = null;
  for (const div of sectionDivs) {
    if (div.querySelector('[automation-testid="flora-GridLayout"]')) {
      gridDiv = div.querySelector('[automation-testid="flora-GridLayout"]');
      break;
    }
    if (div.getAttribute('automation-testid') === 'flora-GridLayout') {
      gridDiv = div;
      break;
    }
  }
  if (!gridDiv) {
    gridDiv = element;
  }

  // Find left and right columns
  let leftCol = null;
  let rightCol = null;
  const gridChildren = gridDiv.querySelectorAll(':scope > div');
  if (gridChildren.length >= 2) {
    leftCol = gridChildren[0];
    rightCol = gridChildren[1];
  } else {
    // fallback: try to find by class
    leftCol = gridDiv.querySelector('.text-center, .md\:text-left');
    rightCol = gridDiv.querySelector('.css-1vy9swr');
  }

  // Find image in right column
  if (rightCol) {
    imageEl = rightCol.querySelector('img');
  }

  // Find heading, subheading, CTA in left column
  if (leftCol) {
    headingEl = leftCol.querySelector('h1, h2, h3, h4, h5, h6');
    // Subheading is a div with font-body
    subheadingEl = leftCol.querySelector('.font-body');
    // CTA is a link inside flora-CTALockup
    const ctaLockup = leftCol.querySelector('[automation-testid="flora-CTALockup"]');
    if (ctaLockup) {
      ctaEl = ctaLockup.querySelector('a');
    }
  }

  // Compose content for row 3
  const contentRow = [];
  if (headingEl) contentRow.push(headingEl);
  if (subheadingEl) contentRow.push(subheadingEl);
  if (ctaEl) contentRow.push(ctaEl);

  // Table rows
  const headerRow = ['Hero (hero97)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRowArr = [contentRow.length ? contentRow : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRowArr,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
