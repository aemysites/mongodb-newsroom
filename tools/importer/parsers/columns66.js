/* global WebImporter */
export default function parse(element, { document }) {
  // Get top-level footer child divs (columns)
  const footer = element.querySelector('footer');
  if (!footer) return;
  const topDivs = Array.from(footer.children).filter(child => child.tagName === 'DIV');

  // --- Column 1: Logo and copyright ---
  let logoDiv = null;
  let copyrightDiv = null;
  for (const div of topDivs) {
    if (!logoDiv && div.querySelector('a img')) logoDiv = div;
    if (!copyrightDiv && /©\s?20/.test(div.textContent)) copyrightDiv = div;
  }
  const col1Content = [];
  if (logoDiv) col1Content.push(logoDiv.querySelector('a'));
  if (copyrightDiv && copyrightDiv !== logoDiv) col1Content.push(copyrightDiv);

  // --- Column 2: About ---
  const aboutDiv = topDivs.find(div => {
    const p = div.querySelector('p');
    return p && p.textContent.trim() === 'About';
  });
  // --- Column 3: Support ---
  const supportDiv = topDivs.find(div => {
    const p = div.querySelector('p');
    return p && p.textContent.trim() === 'Support';
  });
  // --- Column 4: Deployment Options ---
  const deployDiv = topDivs.find(div => {
    const p = div.querySelector('p');
    return p && p.textContent.trim() === 'Deployment Options';
  });

  // Compose columns, but only include non-empty columns
  const columns = [];
  if (col1Content.length) columns.push(col1Content);
  if (aboutDiv) columns.push(aboutDiv);
  if (supportDiv) columns.push(supportDiv);
  if (deployDiv) columns.push(deployDiv);

  // Table header must match block name exactly
  const headerRow = ['Columns (columns66)'];
  const contentRow = columns;

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace original element
  element.replaceWith(table);
}
