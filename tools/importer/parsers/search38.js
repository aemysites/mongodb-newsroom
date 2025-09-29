/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header row
  const headerRow = ['Search (search38)'];

  // The second row must contain ONLY the absolute URL to the query index
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const secondRow = [queryIndexUrl];

  // Compose table rows
  const rows = [headerRow, secondRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
