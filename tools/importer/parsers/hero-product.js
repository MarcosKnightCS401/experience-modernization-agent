/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const heading = element.querySelector('h1');
  const subtitle = element.querySelector('h5, .heading--h5');
  const image = element.querySelector('img.hero-jump-links__mobile-photo-inline, img[alt="Hero photo"]');

  const cells = [];

  if (image) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    pic.appendChild(img);
    imgFrag.appendChild(pic);
    cells.push([imgFrag]);
  }

  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textFrag.appendChild(h1);
  }

  if (subtitle) {
    const text = subtitle.textContent.trim().replace(/\s+/g, ' ');
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      textFrag.appendChild(p);
    }
  }

  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
