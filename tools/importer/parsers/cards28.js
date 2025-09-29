/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers (each card is a div.css-u1flw3 inside an id^="community")
  const cards = [];
  const cardContainers = element.querySelectorAll('[id^="community"] > .css-u1flw3');

  cardContainers.forEach((cardContainer) => {
    // Image/Icon (mandatory): first <img> in the card
    let image = cardContainer.querySelector('img');
    if (!image) image = null;

    // Text content: collect all relevant text content in order
    const textDiv = document.createElement('div');

    // 1. Title: h1, h3, or h5 (in order of appearance in the cardContainer)
    let title = cardContainer.querySelector('h1, h3, h5');
    if (title) {
      textDiv.appendChild(title.cloneNode(true));
    }

    // 2. Description: all <div class="css-zmu6zu"> and their children (including <p>, <pre>, etc)
    const descWrappers = cardContainer.querySelectorAll('.css-zmu6zu');
    descWrappers.forEach((descWrapper) => {
      Array.from(descWrapper.childNodes).forEach((node) => {
        // Only append if not already present (avoid duplicate headings)
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.match(/^H[1-6]$/i)) {
            // skip headings already added as title
            if (title && node.textContent.trim() === title.textContent.trim()) return;
          }
          // Don't include <hr> or <br> at all in cards block
          if (node.tagName === 'HR' || node.tagName === 'BR') return;
          // For <pre>, only include the actual code, not UI/editor markup
          if (node.tagName === 'PRE') {
            // Try to extract code from <textarea> or .CodeMirror-line
            let codeText = '';
            const codeLines = node.querySelectorAll('.CodeMirror-line');
            if (codeLines.length) {
              codeText = Array.from(codeLines).map(l => l.textContent).join('\n').trim();
            } else {
              const textarea = node.querySelector('textarea');
              if (textarea && textarea.textContent.trim()) {
                codeText = textarea.textContent.trim();
              } else {
                codeText = node.textContent.trim();
              }
            }
            if (codeText) {
              const codeBlock = document.createElement('pre');
              codeBlock.textContent = codeText;
              textDiv.appendChild(codeBlock);
            }
            return;
          }
          textDiv.appendChild(node.cloneNode(true));
        }
      });
    });

    // 3. Any <pre> code blocks not already included
    cardContainer.querySelectorAll('pre').forEach((pre) => {
      if (!Array.from(textDiv.querySelectorAll('pre')).some(p => p.textContent.trim() === pre.textContent.trim())) {
        // Only include actual code, not UI/editor markup
        let codeText = '';
        const codeLines = pre.querySelectorAll('.CodeMirror-line');
        if (codeLines.length) {
          codeText = Array.from(codeLines).map(l => l.textContent).join('\n').trim();
        } else {
          const textarea = pre.querySelector('textarea');
          if (textarea && textarea.textContent.trim()) {
            codeText = textarea.textContent.trim();
          } else {
            codeText = pre.textContent.trim();
          }
        }
        if (codeText) {
          const codeBlock = document.createElement('pre');
          codeBlock.textContent = codeText;
          textDiv.appendChild(codeBlock);
        }
      }
    });

    // 4. Any <p> that are direct children of cardContainer and not already added
    cardContainer.querySelectorAll(':scope > p').forEach((p) => {
      if (!Array.from(textDiv.querySelectorAll('p')).some(pp => pp.textContent.trim() === p.textContent.trim())) {
        textDiv.appendChild(p.cloneNode(true));
      }
    });

    // 5. CTA: main download/view button (a[href] inside .css-1myrko)
    let cta = cardContainer.querySelector('.css-1myrko a[href]');
    if (cta) {
      // Remove any <img> inside CTA (icon-only images)
      const ctaClone = cta.cloneNode(true);
      Array.from(ctaClone.querySelectorAll('img')).forEach(img => img.remove());
      const ctaDiv = document.createElement('div');
      ctaDiv.appendChild(ctaClone);
      textDiv.appendChild(ctaDiv);
    }

    cards.push([image, textDiv]);
  });

  // Table rows: header, then one row per card
  const headerRow = ['Cards (cards28)'];
  const rows = [
    headerRow,
    ...cards,
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
