/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const columnContainers = element.querySelectorAll(':scope > .container.responsivegrid');

  const row = [];

  columnContainers.forEach((col) => {
    const frag = document.createDocumentFragment();

    const heading = col.querySelector('h2, h3');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      frag.appendChild(h);
    }

    const textEl = col.querySelector('.cmp-text');
    if (textEl) {
      const text = textEl.textContent.trim().replace(/\s+/g, ' ');
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        frag.appendChild(p);
      }
    }

    const link = col.querySelector('a.button, a.link');
    if (link) {
      const href = link.getAttribute('href') || '#';
      const fullHref = href.startsWith('/') ? `https://www.zimmerbiomet.com${href}` : href;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = fullHref;
      a.textContent = link.textContent.trim().replace(/\s+/g, ' ');
      p.appendChild(a);
      frag.appendChild(p);
    }

    row.push(frag);
  });

  const cells = row.length > 0 ? [row] : [];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
