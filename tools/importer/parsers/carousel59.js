/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all carousel slides from the source HTML
  // The structure is: parent > ... > [carousel tabs] + [carousel content]
  // We need to extract each slide's image and text content

  // 1. Header row
  const headerRow = ['Carousel (carousel59)'];

  // 2. Find carousel content container
  const carouselContent = element.querySelector('[data-testid="use-case-carousel-content"]');
  if (!carouselContent) return;

  // 3. Find all slides (each tabpanel)
  const slides = Array.from(carouselContent.querySelectorAll('[role="tabpanel"]'));
  if (!slides.length) return;

  // 4. Build rows for each slide
  const rows = slides.map((slide) => {
    // --- IMAGE CELL ---
    // Try to find the main image for the slide
    // Prefer the visible image in the left column (hidden on mobile)
    let imageCell = null;
    // Find all images in the slide
    const slideImages = slide.querySelectorAll('img');
    // Try to find the logo image (not the SVG curly bracket)
    let mainImg = null;
    for (const img of slideImages) {
      // Ignore SVG data images (curly bracket)
      if (img.src.startsWith('data:image/svg+xml')) continue;
      // Prefer images with alt containing 'logo' or not empty
      if (img.alt && img.alt.toLowerCase().includes('logo')) {
        mainImg = img;
        break;
      }
      // Fallback: use first non-data image
      if (!mainImg) mainImg = img;
    }
    if (mainImg) {
      imageCell = mainImg;
    } else if (slideImages.length) {
      imageCell = slideImages[0];
    } else {
      imageCell = '';
    }

    // --- TEXT CELL ---
    // Compose the text cell: eyebrow, quote, attribution, CTA
    const textCellContent = [];

    // Eyebrow (category)
    const eyebrow = slide.querySelector('[automation-testid="flora-Eyebrow"]');
    if (eyebrow) {
      textCellContent.push(eyebrow);
    }

    // Quote (main text)
    const quote = slide.querySelector('.font-normal');
    if (quote) {
      // Use h2 for heading if present, otherwise use div
      const heading = document.createElement('h2');
      heading.textContent = quote.textContent;
      textCellContent.push(heading);
    }

    // Attribution (name and role)
    const attribution = slide.querySelector('[automation-testid="flora-TypographyScale"].css-1untns5');
    const role = slide.querySelector('[automation-testid="flora-TypographyScale"].css-w82ni0');
    if (attribution || role) {
      const attributionDiv = document.createElement('div');
      if (attribution) {
        attributionDiv.appendChild(attribution.cloneNode(true));
      }
      if (role) {
        attributionDiv.appendChild(document.createElement('br'));
        attributionDiv.appendChild(role.cloneNode(true));
      }
      textCellContent.push(attributionDiv);
    }

    // CTA (Read Case Study)
    const cta = slide.querySelector('[automation-testid="flora-CTALockup"] a');
    if (cta) {
      textCellContent.push(cta);
    }

    // Defensive: If nothing found, fallback to entire right column
    if (textCellContent.length === 0) {
      // Try to find the main right column
      const rightCol = slide.querySelector('.grow');
      if (rightCol) textCellContent.push(rightCol);
    }

    return [imageCell, textCellContent];
  });

  // 5. Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
