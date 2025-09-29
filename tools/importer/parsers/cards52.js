/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'Atlas Database use cases' section by heading
  let useCasesSection = null;
  const gridSections = element.querySelectorAll('div[automation-testid="bonsai-Grid"]');
  for (const section of gridSections) {
    const heading = section.querySelector('h2');
    if (heading && heading.textContent.trim().toLowerCase().includes('atlas database use cases')) {
      useCasesSection = section;
      break;
    }
  }
  if (!useCasesSection) return;

  // Extract all card sections
  const cardSections = useCasesSection.querySelectorAll('section[automation-testid="flora-FlashCard"]');
  if (!cardSections.length) return;

  // Compose table rows
  const headerRow = ['Cards (cards52)'];
  const tableRows = [headerRow];

  cardSections.forEach(cardSection => {
    // Image/Icon
    const img = cardSection.querySelector('img[automation-testid="flora-SingleImage-Image"]') || cardSection.querySelector('img');
    const imageCell = img ? img.cloneNode(true) : '';

    // Text cell: grab all text content (title, description, cta)
    const textCellContent = [];
    // Title
    const titleEl = cardSection.querySelector('h3[automation-testid="flora-TypographyScale"]');
    if (titleEl) textCellContent.push(titleEl.cloneNode(true));
    // Description
    const descEl = cardSection.querySelector('div[automation-testid="flora-TypographyScale"]');
    if (descEl) textCellContent.push(descEl.cloneNode(true));
    // CTA
    const ctaEl = cardSection.querySelector('a');
    if (ctaEl) textCellContent.push(ctaEl.cloneNode(true));
    // Defensive fallback: if nothing found, use all text
    if (!textCellContent.length) {
      textCellContent.push(document.createTextNode(cardSection.textContent.trim()));
    }

    tableRows.push([imageCell, textCellContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the useCasesSection with the block
  useCasesSection.replaceWith(block);
}
