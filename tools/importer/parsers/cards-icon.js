/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-icon
 * Base block: cards-icon
 * Source selector: #container-cc502a8965
 * Description: Cards variant for icon grids. Each row = one card with small icon image and text link.
 * Project type: xwalk (field hinting enabled)
 * UE Model fields: items (richtext)
 * Generated: 2026-05-03T00:00:00Z
 */
export default function parse(element, { document }) {
  // Each card is a direct child .container.responsivegrid of the root container
  const cardContainers = element.querySelectorAll(':scope > .container.responsivegrid');

  const cells = [];

  cardContainers.forEach((card) => {
    const img = card.querySelector('.cmp-image__image, img');
    const textLink = card.querySelector('.cmp-text a, .cmp-text p');

    // Column 1: image (maps to "image" reference field)
    const col1 = document.createElement('div');
    col1.appendChild(document.createComment(' field:image '));
    if (img) {
      const p = document.createElement('p');
      const pic = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      imgClone.removeAttribute('class');
      pic.appendChild(imgClone);
      p.appendChild(pic);
      col1.appendChild(p);
    }

    // Column 2: text (maps to "text" richtext field)
    const col2 = document.createElement('div');
    col2.appendChild(document.createComment(' field:text '));
    if (textLink) {
      const linkClone = textLink.cloneNode(true);
      col2.appendChild(linkClone);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
