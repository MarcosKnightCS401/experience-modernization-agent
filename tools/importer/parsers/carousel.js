/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel variant.
 * Base block: carousel
 * Selector: .generic-carousel
 * Project type: xwalk (field hinting enabled)
 * UE model field: items (richtext)
 *
 * Source: Zimmer Biomet homepage product carousel
 * Each slide contains a product card with image, h3 title, and link.
 * The tns carousel clones slides — parser excludes cloned slides to avoid duplicates.
 *
 * Generated: 2026-05-03
 * DOM selectors validated from cached source.html
 */
export default function parse(element, { document }) {
  // Select only real carousel slides, excluding tns cloned duplicates.
  // Real slides have id attributes like tns1-item0, tns1-item1, etc.
  // Cloned slides have the class .tns-slide-cloned.
  const slides = element.querySelectorAll('.carousel__slide:not(.tns-slide-cloned)');

  const cells = [];

  slides.forEach((slide) => {
    const link = slide.querySelector('a.link, a[href]');
    if (!link) return;

    const img = slide.querySelector('img.image, img');
    const heading = slide.querySelector('h3.heading, h3');

    // Column 1: image (maps to "image" reference field)
    const col1 = document.createElement('div');
    col1.appendChild(document.createComment(' field:image '));
    if (img) {
      const p = document.createElement('p');
      const pic = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      pic.appendChild(imgClone);
      p.appendChild(pic);
      col1.appendChild(p);
    }

    // Column 2: text (maps to "text" richtext field)
    const col2 = document.createElement('div');
    col2.appendChild(document.createComment(' field:text '));
    if (heading && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = heading.textContent.trim();
      const h3 = document.createElement('h3');
      h3.appendChild(a);
      col2.appendChild(h3);
    } else if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      col2.appendChild(h3);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel',
    cells,
  });

  element.replaceWith(block);
}
