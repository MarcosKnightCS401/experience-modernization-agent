/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-news
 * Base block: cards
 * Source: https://www.zimmerbiomet.com/en
 * Selector: #container-38830d0ee9
 * Generated: 2026-05-03
 *
 * Extracts news aggregate cards. Each card has:
 *   - Image (from header img)
 *   - Category tag badge (e.g. "News")
 *   - Headline paragraph
 *   - "Read more" link (wrapping anchor)
 *
 * Source structure per card:
 *   .news-aggregate-card > a.card
 *     > header > img
 *     > .card__body
 *       > .tag (category badge)
 *       > .rich-text p (headline)
 *       > .link--utility (read more text)
 *
 * UE model: cards-news (container block, items field)
 * Each card becomes one row with a single cell containing all card content.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope > .news-aggregate-card');
  const cells = [];

  cards.forEach((card) => {
    const anchor = card.querySelector('a.news-aggregate-card');
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';

    // Extract image from card header
    const img = card.querySelector('header img, .card__header img');

    // Extract category tag (e.g. "News")
    const tag = card.querySelector('.tag');

    // Extract headline from rich-text area
    const headline = card.querySelector('.rich-text p, .rich-text');

    // Extract "Read more" link text element
    const readMore = card.querySelector('.link--utility');

    // Column 1: image (maps to "image" reference field)
    const col1 = document.createElement('div');
    col1.appendChild(document.createComment(' field:image '));
    if (img) {
      const p = document.createElement('p');
      const pic = document.createElement('picture');
      pic.appendChild(img.cloneNode(true));
      p.appendChild(pic);
      col1.appendChild(p);
    }

    // Column 2: text (maps to "text" richtext field)
    const col2 = document.createElement('div');
    col2.appendChild(document.createComment(' field:text '));
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      col2.appendChild(tagP);
    }
    if (headline) {
      const headlineP = document.createElement('p');
      headlineP.textContent = headline.textContent.trim();
      col2.appendChild(headlineP);
    }
    if (href) {
      const linkP = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = readMore ? readMore.textContent.trim() : 'Read more';
      linkP.appendChild(link);
      col2.appendChild(linkP);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
