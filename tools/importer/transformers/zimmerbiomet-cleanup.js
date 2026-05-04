/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Zimmer Biomet site-wide cleanup.
 * Removes non-authorable content (headers, footers, cookie banners, navigation overlays).
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#ot-sdk-btn-floating',
      '.onetrust-pc-dark-filter',
      '[data-acsb-hidden]',
      '[data-acsb-force-hidden]',
      '.acsb-trigger',
      '#acsb-widget',
    ]);

    const paragraphs = element.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.textContent.includes('screen-reader mode') || p.textContent.includes('accessibe.com')) {
        p.remove();
      }
    });

    const imgs = element.querySelectorAll('img');
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('bat.bing.com') || src.includes('facebook.com/tr') || src.includes('doubleclick.net') || src.includes('liadm.com') || src.includes('sharethis.com')) {
        const picture = img.closest('picture');
        const container = picture ? picture.closest('p') || picture : img.closest('p') || img;
        container.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Experience fragment wrappers that contain header and footer chrome
    // Header XF (line 21: div.cmp-experiencefragment--header wraps all header elements)
    // Footer XF (line 1360: div.cmp-experiencefragment--footer wraps footer, mobile menu, find-a-doc)
    // Desktop header (line 24: header.global-header-v2 .global-header--desktop)
    // Mobile header (line 436: header.global-header-v2 .global-header--mobile)
    // Global footer (line 1363: footer.global-footer)
    // Mobile menu (line 1475: .mobile-menu inside footer XF)
    // Mega menu panels (lines 36, 119, 194, 334: .navigation__mega-menu)
    // Find a doctor CTA widget (line 231: .find-a-doctor__cta)
    // Iframes including OneTrust text-resize (lines 2089, 2105)
    // Link elements, noscript tags
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'header.global-header-v2',
      'footer.global-footer',
      '.mobile-menu',
      '.navigation__mega-menu',
      '.find-a-doctor__cta',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove accessiBe screen reader widget text
    const allParagraphs = element.querySelectorAll('p');
    allParagraphs.forEach((p) => {
      if (p.textContent.includes('screen-reader mode') || p.textContent.includes('accessibe.com')) {
        p.remove();
      }
    });

    // Remove tracking pixel images (bat.bing.com, etc.)
    const imgs = element.querySelectorAll('img');
    imgs.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('bat.bing.com') || src.includes('facebook.com/tr') || src.includes('doubleclick.net') || src.includes('liadm.com') || src.includes('sharethis.com')) {
        const picture = img.closest('picture');
        const container = picture ? picture.closest('p') || picture : img.closest('p') || img;
        container.remove();
      }
    });
  }
}
