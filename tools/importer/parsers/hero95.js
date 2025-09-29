/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first image in the block
  function getImageEl(el) {
    // Look for any <img> inside the element
    const img = el.querySelector('img');
    return img || null;
  }

  // Helper to collect heading, subheading, paragraph, CTA
  function getContentEl(el) {
    // Find the main content container (the one with heading, paragraph, CTA)
    // In the source HTML, it's the first div with class css-y7d1fm
    const contentDiv = el.querySelector('.css-y7d1fm');
    if (!contentDiv) return null;

    // Heading
    const heading = contentDiv.querySelector('h3');
    // Subheading (the next div with a span)
    const subheadingDiv = contentDiv.querySelector('.css-1q2mivt');
    // Paragraph (inside subheadingDiv as <span>)
    const subheading = subheadingDiv ? subheadingDiv.querySelector('span') : null;
    // CTA container (div.css-1fel3o7)
    const ctaDiv = contentDiv.querySelector('.css-1fel3o7');
    let ctas = [];
    if (ctaDiv) {
      // Get all links in CTA container
      const links = Array.from(ctaDiv.querySelectorAll('a'));
      ctas = links;
    }

    // Compose elements for the cell
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (subheading) cellContent.push(subheading);
    if (ctas.length) cellContent.push(...ctas);
    return cellContent.length ? cellContent : null;
  }

  // Find the image for the 2nd row
  // In the source HTML, it's inside .css-1fci34v
  const imageDiv = element.querySelector('.css-1fci34v');
  const imageEl = imageDiv ? getImageEl(imageDiv) : null;

  // Find the content for the 3rd row
  const contentEls = getContentEl(element);

  // Build table rows
  const headerRow = ['Hero (hero95)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls ? contentEls : ''];

  const rows = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
