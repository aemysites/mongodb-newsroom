/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content container
  const blockRoot = element.querySelector(':scope > div > section > div');
  if (!blockRoot) return;

  // Find all immediate children of the main grid
  const children = Array.from(blockRoot.children);

  // Find background image (decorative, usually absolute positioned)
  let backgroundImg = null;
  children.forEach((child) => {
    if (
      child.tagName === 'IMG' &&
      child.classList.contains('absolute')
    ) {
      backgroundImg = child;
    }
  });

  // Find the text and CTA column (usually first div)
  let textCol = children.find(
    (c) => c.tagName === 'DIV' && c.querySelector('h4, h1, h2, h3, p, a')
  );

  // Find the main illustration (usually second div)
  let illustrationCol = children.find(
    (c) =>
      c.tagName === 'DIV' &&
      c.querySelector('img') &&
      !c.querySelector('img.absolute')
  );

  // Defensive: fallback for illustration if not found
  let mainImg = null;
  if (illustrationCol) {
    mainImg = illustrationCol.querySelector('img');
  }

  // Row 1: Block name
  const headerRow = ['Hero (hero96)'];

  // Row 2: Background image (optional)
  // Use the decorative image if present, else the main illustration
  let backgroundCell = null;
  if (backgroundImg) {
    backgroundCell = backgroundImg;
  } else if (mainImg) {
    backgroundCell = mainImg;
  } else {
    backgroundCell = '';
  }

  // Row 3: Title, subheading, CTA
  // Gather heading, paragraph, CTA from textCol
  let title = null;
  let subheading = null;
  let cta = null;
  if (textCol) {
    title = textCol.querySelector('h1, h2, h3, h4');
    subheading = textCol.querySelector('p');
    cta = textCol.querySelector('a');
  }
  // Compose row 3 cell contents
  const row3Content = [];
  if (title) row3Content.push(title);
  if (subheading) row3Content.push(subheading);
  if (cta) row3Content.push(cta);

  // Build table array
  const cells = [
    headerRow,
    [backgroundCell],
    [row3Content],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
