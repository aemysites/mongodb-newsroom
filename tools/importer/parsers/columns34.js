/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the headline and subtitle
  const headline = element.querySelector('.SectionOverview__Headline-sc-fmryzh-1');
  const subtitle = element.querySelector('.SectionOverview__Content-sc-fmryzh-2');

  // Extract the two tab buttons
  const buttonWrapper = element.querySelector('.GenericTabs__ButtonWrapper-sc-1fb0yzj-1');
  let tab1 = null;
  let tab2 = null;
  if (buttonWrapper) {
    const buttons = buttonWrapper.querySelectorAll('button');
    if (buttons.length > 0) tab1 = buttons[0];
    if (buttons.length > 1) tab2 = buttons[1];
  }

  // Compose left column: headline, subtitle, first tab
  const leftCol = [];
  if (headline) leftCol.push(headline);
  if (subtitle) leftCol.push(subtitle);
  if (tab1) leftCol.push(tab1);

  // Compose right column: second tab
  const rightCol = [];
  if (tab2) rightCol.push(tab2);

  // Table header must match target block name exactly
  const headerRow = ['Columns (columns34)'];
  const columnsRow = [leftCol, rightCol];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace element with table
  element.replaceWith(table);
}
