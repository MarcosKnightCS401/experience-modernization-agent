/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Zimmer Biomet site cleanup.
 * Selectors from captured DOM of zimmerbiomet.com.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent, overlays, and navigation chrome early
    // so they don't interfere with block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      // Experience fragments (header, footer, legal disclaimer)
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      // Keep .cmp-experiencefragment--product-pages-legal-disclaimer (authorable content)
      // Global headers (desktop + mobile)
      'header.global-header-v2',
      '.global-header-v2',
      '.global-header--mobile',
      '.global-header--desktop',
      // Navigation elements (all types)
      'nav.navigation',
      'nav.navigation--mobile',
      'nav.navigation--primary',
      'nav.navigation--utility',
      // Mega menu content inside navigation
      '.navigation__mega-menu',
      '.large--border',
      // Sticky container (header chrome)
      '.sticky-container',
    ]);
  }
  if (hookName === H.after) {
    // Remove remaining non-authorable content after block parsing:
    // - Footer elements
    // - Utility nav links
    // - iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      'footer.global-footer',
      'div.global-footer',
      '.global-footer--utility',
      '.global-footer--primary-container',
      '.global-footer--info-section',
      'nav.educationEventsLinks',
      'nav.news-room',
      'nav.education-events',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
