/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main footer element
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Get all top-level columns (divs with heading and list)
  const columns = [];

  // 1. Logo + Language selector + copyright (left column)
  const leftCol = document.createElement('div');
  // Logo
  const logoDiv = footer.querySelector('.css-14m6znr');
  if (logoDiv) leftCol.appendChild(logoDiv);
  // Language selector (icon, button, list)
  const langDiv = footer.querySelector('.css-fdx146');
  if (langDiv) leftCol.appendChild(langDiv);
  // Copyright (top left)
  const copyrightDiv = footer.querySelector('.css-xzohzf');
  if (copyrightDiv) leftCol.appendChild(copyrightDiv);
  columns.push(leftCol);

  // 2. About
  const aboutDiv = footer.querySelector('.css-10ym41u:nth-of-type(1)');
  if (aboutDiv) {
    columns.push(aboutDiv);
  }
  // 3. Support
  const supportDiv = footer.querySelector('.css-10ym41u:nth-of-type(2)');
  if (supportDiv) {
    columns.push(supportDiv);
  }
  // 4. Deployment Options
  const deployDiv = footer.querySelector('.css-10ym41u:nth-of-type(3)');
  if (deployDiv) {
    columns.push(deployDiv);
  }
  // 5. Data Basics
  const dataDiv = footer.querySelector('.css-kyozxs');
  if (dataDiv) {
    columns.push(dataDiv);
  }

  // 6. Copyright (bottom right, only if not already included)
  const copyrightDiv2 = footer.querySelector('.css-fufvgk');
  if (copyrightDiv2 && copyrightDiv2 !== copyrightDiv) {
    const copyrightCol = document.createElement('div');
    copyrightCol.appendChild(copyrightDiv2);
    columns.push(copyrightCol);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns79)'];
  const tableRows = [headerRow, columns];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
