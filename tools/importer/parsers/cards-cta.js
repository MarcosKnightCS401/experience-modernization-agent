/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-cta variant.
 * Base block: cards (container block).
 * Source: https://www.zimmerbiomet.com/en/support.html
 * Source DOM: .cta-card elements with header.card__header + a.link
 * UE model: card { image (reference), text (richtext) }
 * Block library: 2 columns per row (image + text), each row = one card
 */
export default function parse(element, { document }) {
  // Find all CTA card elements within the container
  const cardElements = element.querySelectorAll('.cta-card > .card');

  const cells = [];

  cardElements.forEach((card) => {
    // Extract title from card header
    const header = card.querySelector('header.card__header');
    // Extract CTA link
    const link = card.querySelector('a.link');

    // Build text content cell (col 2): title as strong + CTA link
    const textContainer = document.createDocumentFragment();

    // Field hint for image (col 1) - empty for CTA cards
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));

    // Field hint for text (col 2)
    textContainer.appendChild(document.createComment(' field:text '));

    if (header) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = header.textContent.trim();
      p.appendChild(strong);
      textContainer.appendChild(p);
    }

    if (link) {
      const href = link.getAttribute('href') || '#';
      const fullHref = href.startsWith('/') ? `https://www.zimmerbiomet.com${href}` : href;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = fullHref;
      a.textContent = 'Learn more';
      p.appendChild(a);
      textContainer.appendChild(p);
    }

    // Each row = [image cell (empty), text cell]
    cells.push([imageCell, textContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-cta', cells });
  element.replaceWith(block);
}
