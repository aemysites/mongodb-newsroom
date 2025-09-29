/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the first descendant image in the block
  function findFirstImage(el) {
    return el.querySelector('img');
  }

  // Helper: Get the main text content container (for title, subheading, CTA)
  function findTextContentContainer(el) {
    // Find the deepest div that contains h5 or span with text
    const candidates = Array.from(el.querySelectorAll('div'));
    for (let i = candidates.length - 1; i >= 0; i--) {
      const c = candidates[i];
      if (
        c.querySelector('h1, h2, h3, h4, h5, h6, span') &&
        c.textContent.trim().length > 0
      ) {
        return c;
      }
    }
    return el;
  }

  // 1. Header row
  const headerRow = ['Hero (hero49)'];

  // 2. Image row (background image)
  const img = findFirstImage(element);
  const imageRow = [img ? img : ''];

  // 3. Content row (title, subheading, CTA)
  const textContainer = findTextContentContainer(element);
  let contentNodes = [];

  // Try to extract title, subheading, CTA in order
  // Title (h5 or strong span)
  const title = textContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (title) contentNodes.push(title);

  // Subheading: next span after title, or a span with a lot of text
  let subheading = null;
  if (title) {
    subheading = title.nextElementSibling;
    if (subheading && subheading.tagName.toLowerCase() === 'span' && subheading.textContent.trim().length > 0) {
      contentNodes.push(subheading);
    } else {
      subheading = null;
    }
  }
  if (!subheading) {
    // fallback: find a span with a lot of text
    const spans = textContainer.querySelectorAll('span');
    for (let s of spans) {
      if (s.textContent.trim().length > 40 && (!title || !title.contains(s))) {
        contentNodes.push(s);
        break;
      }
    }
  }

  // CTA: last span with short text ("Start Learning")
  const allSpans = Array.from(textContainer.querySelectorAll('span'));
  let cta = null;
  for (let i = allSpans.length - 1; i >= 0; i--) {
    const s = allSpans[i];
    if (s.textContent.trim().length > 0 && s.textContent.trim().length <= 30 && !contentNodes.includes(s)) {
      cta = s;
      break;
    }
  }
  if (cta) contentNodes.push(cta);

  // Fallback: if nothing found, use all text content
  if (contentNodes.length === 0) {
    contentNodes = Array.from(textContainer.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0));
  }

  const contentRow = [contentNodes.length > 0 ? contentNodes : ''];

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
