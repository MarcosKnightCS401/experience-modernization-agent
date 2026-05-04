/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Base block: columns
 * Source: https://www.zimmerbiomet.com/en
 * Selector: #container-46b580d3ab
 *
 * Banner-style columns with two side-by-side panels.
 * Each panel has: background image, heading (h2), description, CTA link.
 * Left panel: Investor Relations / Shareholder Value (stock price widget excluded).
 * Right panel: Careers / Join Our Global Team.
 *
 * Columns block (xwalk) — no field hints required per hinting rules.
 */
export default function parse(element, { document }) {
  // Each panel is a direct-child .container.responsivegrid with a 6-col grid
  const columnContainers = element.querySelectorAll(':scope > .container.responsivegrid');

  const row = [];

  columnContainers.forEach((col) => {
    const frag = document.createDocumentFragment();

    // Background image: first <img> that is NOT an inline SVG data URI
    const images = col.querySelectorAll('img');
    let bgImage = null;
    for (const img of images) {
      const src = img.getAttribute('src') || '';
      if (!src.startsWith('data:')) {
        bgImage = img;
        break;
      }
    }
    if (bgImage) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = bgImage.getAttribute('src');
      const alt = bgImage.getAttribute('alt') || '';
      if (alt) imgEl.alt = alt;
      picture.appendChild(imgEl);
      frag.appendChild(picture);
    }

    // Heading: h2 (primary heading in each panel)
    const heading = col.querySelector('h2, h3');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      frag.appendChild(h);
    }

    // Description: paragraph text from .cmp-text
    const textEl = col.querySelector('.cmp-text');
    if (textEl) {
      const paragraphs = textEl.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        // Skip empty or whitespace-only paragraphs (&nbsp;)
        if (text && text !== ' ') {
          const para = document.createElement('p');
          para.textContent = text;
          frag.appendChild(para);
        }
      });
    }

    // CTA link: anchor with .button class
    const ctaLink = col.querySelector('a.button');
    if (ctaLink) {
      const href = ctaLink.getAttribute('href') || '#';
      // Extract link text from direct text nodes only (skip inline SVG icon text)
      let linkText = '';
      ctaLink.childNodes.forEach((node) => {
        if (node.nodeType === 3) { // Text node
          linkText += node.textContent;
        }
      });
      linkText = linkText.trim();

      if (linkText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = linkText;
        p.appendChild(a);
        frag.appendChild(p);
      }
    }

    row.push(frag);
  });

  const cells = row.length > 0 ? [row] : [];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
