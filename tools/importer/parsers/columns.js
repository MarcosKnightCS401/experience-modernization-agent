/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns
 * Base block: columns
 * Source: https://www.zimmerbiomet.com/en
 * Selector: #container-378407a0e6
 * Generated: 2026-05-03
 *
 * Extracts 3 CTA navigation buttons displayed horizontally as columns.
 * Each div.button contains an anchor link; each becomes one column cell.
 * xwalk project — columns blocks are exempt from field hinting per hinting rules.
 */
export default function parse(element, { document }) {
  // Select all div.button containers that hold anchor links (skip trailing div.text spacer)
  const buttonDivs = element.querySelectorAll(':scope > div.button');

  // Build one row where each button becomes a separate column cell
  const row = [];
  buttonDivs.forEach((btnDiv) => {
    const anchor = btnDiv.querySelector('a');
    if (anchor) {
      // Remove decorative arrow icon images inside the anchor
      const icons = anchor.querySelectorAll('img');
      icons.forEach((icon) => icon.remove());

      // Create a clean paragraph with the link for proper default-content rendering
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = anchor.href;
      link.textContent = anchor.textContent.trim();
      p.appendChild(link);

      // Each button is a separate column cell
      row.push([p]);
    }
  });

  // cells: single row with 3 column cells
  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
