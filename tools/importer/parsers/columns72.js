/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns72)'];

  // Defensive: Find the main flex container (should be only one)
  const flexContainer = element.querySelector('[aria-label="flex-container"]');
  if (!flexContainer) return;

  // Find the section inside the flex container (the card)
  const section = flexContainer.querySelector('section');
  if (!section) return;

  // Find the anchor (card link)
  const cardLink = section.querySelector('a');
  if (!cardLink) return;

  // --- COLUMN 1: Text content ---
  // Find the content wrapper (contains heading, paragraph, and CTA)
  const textContentWrapper = cardLink.querySelector('.css-47j2ug');
  let textColContent = [];
  if (textContentWrapper) {
    // Heading
    const heading = textContentWrapper.querySelector('h3');
    if (heading) textColContent.push(heading);
    // Paragraph
    const para = textContentWrapper.querySelector('p');
    if (para) textColContent.push(para);
    // CTA ("Learn more")
    const cta = textContentWrapper.querySelector('.css-374oea');
    if (cta) textColContent.push(cta);
  }

  // --- COLUMN 2: Image ---
  // Find the card-header image
  let imageColContent = [];
  const cardHeader = cardLink.querySelector('[aria-label="card-header"]');
  if (cardHeader) {
    const img = cardHeader.querySelector('img');
    if (img) imageColContent.push(img);
  }

  // If no image found, fallback to empty cell
  if (imageColContent.length === 0) imageColContent = [''];
  if (textColContent.length === 0) textColContent = [''];

  // Build the table rows
  const rows = [
    headerRow,
    [textColContent, imageColContent],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
