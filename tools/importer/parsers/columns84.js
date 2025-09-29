/* global WebImporter */
export default function parse(element, { document }) {
  // Get the desktop table and mobile div
  const desktopTable = element.querySelector(':scope > table');
  const mobileDiv = element.querySelector(':scope > div');

  // Get desktop table headers
  const headerCells = Array.from(desktopTable.querySelectorAll('thead th'));
  const numCols = headerCells.length;

  // Prepare columns: each column will contain all content for that type (desktop and mobile)
  const columns = [];
  for (let i = 0; i < numCols; i++) {
    const colDiv = document.createElement('div');
    // Add desktop header as plain text
    colDiv.appendChild(document.createTextNode(headerCells[i].textContent));
    // Add desktop table rows for this column
    Array.from(desktopTable.querySelectorAll('tbody tr')).forEach(row => {
      const cell = row.children[i];
      if (cell) {
        Array.from(cell.childNodes).forEach(node => {
          colDiv.appendChild(node.cloneNode(true));
        });
      }
    });
    // Add mobile content for this column if available, but only if not already present (avoid duplication)
    if (mobileDiv) {
      const mobileHeadings = Array.from(mobileDiv.querySelectorAll('h4'));
      const mobileTables = Array.from(mobileDiv.querySelectorAll('table'));
      let mobileIndex = mobileHeadings.findIndex(h => h.textContent.trim().toLowerCase() === headerCells[i].textContent.trim().toLowerCase());
      if (mobileIndex !== -1 && mobileTables[mobileIndex]) {
        // Only add heading if it's not already the same as the desktop header
        if (mobileHeadings[mobileIndex].textContent.trim() !== headerCells[i].textContent.trim()) {
          colDiv.appendChild(document.createTextNode(mobileHeadings[mobileIndex].textContent));
        }
        // Only add mobile table content if it is different from desktop
        const desktopTexts = Array.from(desktopTable.querySelectorAll('tbody tr')).map(row => {
          const cell = row.children[i];
          return cell ? cell.textContent.trim() : '';
        });
        Array.from(mobileTables[mobileIndex].querySelectorAll('tbody tr')).forEach(row => {
          Array.from(row.children).forEach(cell => {
            // Only add if not already present in desktopTexts
            if (!desktopTexts.includes(cell.textContent.trim())) {
              Array.from(cell.childNodes).forEach(node => {
                colDiv.appendChild(node.cloneNode(true));
              });
            }
          });
        });
      }
    }
    columns.push(colDiv);
  }

  // Compose the block table
  const headerRow = ['Columns (columns84)'];
  const columnsRow = columns;
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
