/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main image for the hero
  function findHeroImage(el) {
    // Look for img elements inside the block
    const imgs = el.querySelectorAll('img');
    if (imgs.length > 0) {
      return imgs[0]; // Reference the actual image element
    }
    return '';
  }

  // Helper to find the main heading/subheading/paragraph/button area
  function findHeroTextContent(el) {
    // Defensive: find the div that contains the heading, subheading, paragraph, and CTA
    // The main text block is the first child div of the first child div
    // But we need to ensure we capture all relevant text and links
    // Find the deepest div containing h1, span, and links
    const mainTextBlock = el.querySelector('.css-1nla2wl');
    return mainTextBlock || el;
  }

  // Compose table rows
  const headerRow = ['Hero (hero5)']; // Must match target block name exactly
  const imageRow = [findHeroImage(element)]; // Reference image element, not URL
  const textRow = [findHeroTextContent(element)]; // Reference actual content element

  // Create table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
