/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a press/news card anchor
  function extractCardInfo(a) {
    const cardDiv = a.querySelector('div');
    if (!cardDiv) return [a.href, a.textContent.trim()]; // fallback, shouldn't happen
    const paragraphs = cardDiv.querySelectorAll('p');
    let title = '';
    let desc = '';
    let source = '';
    let date = '';
    if (paragraphs.length === 3) {
      source = paragraphs[0].textContent.trim();
      title = paragraphs[1].textContent.trim();
      date = paragraphs[2].textContent.trim();
    } else {
      title = paragraphs[1]?.textContent.trim() || '';
      date = paragraphs[2]?.textContent.trim() || '';
    }
    // Compose text cell
    const textCell = document.createElement('div');
    if (source) {
      const sourceEl = document.createElement('div');
      sourceEl.style.fontSize = '13px';
      sourceEl.style.color = '#b3b3b3';
      sourceEl.textContent = source;
      textCell.appendChild(sourceEl);
    }
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title;
      textCell.appendChild(h);
    }
    if (date) {
      const dateEl = document.createElement('div');
      dateEl.style.color = '#00AA57';
      dateEl.textContent = date;
      textCell.appendChild(dateEl);
    }
    // Only one column: all content in one cell
    return [textCell];
  }

  const leftCol = element.querySelector(':scope > div.w-max-650');
  const rightCol = element.querySelector(':scope > div.w-max-360');

  const rows = [];
  const headerRow = ['Cards (cards41)']; // Only one column, per block guidelines when no images
  rows.push(headerRow);

  if (leftCol) {
    let pressCards = [];
    let newsCards = [];
    let foundPress = false;
    let foundNews = false;
    let children = Array.from(leftCol.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.tagName === 'H3' && child.textContent.includes('Press Releases')) {
        foundPress = true;
        foundNews = false;
        continue;
      }
      if (child.tagName === 'H3' && child.textContent.includes('News')) {
        foundNews = true;
        foundPress = false;
        continue;
      }
      if (child.tagName === 'A') {
        if (foundPress) {
          pressCards.push(child);
        } else if (foundNews) {
          newsCards.push(child);
        }
      }
    }
    pressCards.forEach(a => {
      rows.push(extractCardInfo(a));
    });
    newsCards.forEach(a => {
      rows.push(extractCardInfo(a));
    });
  }

  if (rightCol) {
    // Media Kit section
    const mediaKitH3 = rightCol.querySelector('h3.w-full.m-l-15');
    const mediaKitDiv = mediaKitH3?.nextElementSibling;
    if (mediaKitDiv && mediaKitDiv.querySelectorAll('a').length) {
      const links = Array.from(mediaKitDiv.querySelectorAll('a')).map(a => {
        const link = document.createElement('a');
        link.href = a.href;
        link.textContent = a.textContent.trim();
        return link;
      });
      const textCell = document.createElement('div');
      textCell.append(...links);
      rows.push([textCell]);
    }
    // Media and Analyst Contacts
    const contactsH3 = rightCol.querySelectorAll('h3.w-full.m-l-15')[1];
    const contactsDiv = contactsH3?.nextElementSibling;
    if (contactsDiv && contactsDiv.querySelectorAll('a').length) {
      const contacts = Array.from(contactsDiv.querySelectorAll('p')).map(p => {
        const div = document.createElement('div');
        div.innerHTML = p.innerHTML;
        return div;
      });
      const textCell = document.createElement('div');
      textCell.append(...contacts);
      rows.push([textCell]);
    }
    // Brand Resources
    const brandH3 = rightCol.querySelectorAll('h3.w-full.m-l-15')[2];
    const brandDiv = brandH3?.nextElementSibling;
    if (brandDiv && brandDiv.querySelector('a')) {
      const link = brandDiv.querySelector('a');
      const linkEl = document.createElement('a');
      linkEl.href = link.href;
      linkEl.textContent = link.textContent.trim();
      const textCell = document.createElement('div');
      textCell.appendChild(document.createTextNode('For MongoDB logos and marketing assets, visit our '));
      textCell.appendChild(linkEl);
      textCell.appendChild(document.createTextNode('.'));
      rows.push([textCell]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
