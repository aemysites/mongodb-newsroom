/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main promo banner
  const banner = element.querySelector('[automation-testid="bonsai-PromotionBanner"]');
  if (!banner) return;

  // --- Background Image (row 2) ---
  // The background image is the main illustration on the right
  let bgImg = null;
  // Find the main image (not the SVG decorative background)
  const imgs = banner.querySelectorAll('img');
  for (const img of imgs) {
    if (img.src && !img.src.startsWith('data:image/svg+xml')) {
      bgImg = img;
      break;
    }
  }

  // --- Content (row 3) ---
  // Find the text wrapper (left side)
  const textWrapper = banner.querySelector('[data-testid="promo-banner-text-wrapper"]');
  let contentEls = [];
  if (textWrapper) {
    // Heading
    const heading = textWrapper.querySelector('h2');
    if (heading) contentEls.push(heading);
    // Subheading (the div after h2)
    if (heading && heading.nextElementSibling && heading.nextElementSibling.tagName === 'DIV') {
      contentEls.push(heading.nextElementSibling);
    }
    // CTA (button/link)
    const ctaWrapper = textWrapper.querySelector('[data-testid="promotion-banner-cta-wrapper"]');
    if (ctaWrapper) {
      const ctaLink = ctaWrapper.querySelector('a[href]');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }

  // Compose Table
  const headerRow = ['Hero (hero50)'];
  const bgRow = [bgImg ? bgImg : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bgRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
