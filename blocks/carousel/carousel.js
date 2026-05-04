import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.classList.add('carousel-items');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('carousel-item');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'carousel-item-image';
      } else {
        div.className = 'carousel-item-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '450' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);

  const scrollAmount = 300;

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-prev';
  prevBtn.textContent = '‹';
  prevBtn.addEventListener('click', () => {
    ul.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-next';
  nextBtn.textContent = '›';
  nextBtn.addEventListener('click', () => {
    ul.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  nav.append(prevBtn, nextBtn);
  block.append(nav);
}
