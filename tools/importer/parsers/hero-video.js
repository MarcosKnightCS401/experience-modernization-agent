/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video
 * Base block: hero
 * Source: https://www.zimmerbiomet.com/en
 * Selector: .video-hero-banner
 * Project type: xwalk (field hinting enabled)
 * UE Model fields: content (richtext), videoUrl (text)
 * Generated: 2026-05-03
 */
export default function parse(element, { document }) {
  // --- Extract heading ---
  // Source: h1.heading--h1 containing <p>You'll Be Back.</p>
  const heading = element.querySelector('h1.heading--h1, h1[class*="heading"], h1');

  // --- Extract descriptive text ---
  // Source: .rich-text.video-hero-banner__content contains paragraph text
  const richTextContainer = element.querySelector('.rich-text.video-hero-banner__content, .video-hero-banner__content, .rich-text');
  const paragraphs = richTextContainer
    ? Array.from(richTextContainer.querySelectorAll(':scope > p'))
    : [];

  // --- Extract CTA link ---
  // Source: a.button.video-hero-banner__cta-button
  const ctaLink = element.querySelector('a.video-hero-banner__cta-button, a.button.video-hero-banner__cta-button, .video-hero-banner__actions a');

  // --- Extract video URL ---
  // Source: <source src="..."> inside video.s7videoelement
  const videoSource = element.querySelector('video.s7videoelement source, video source, source[src]');
  const videoUrl = videoSource ? videoSource.getAttribute('src') : '';

  // --- Build Row 1: content (richtext) ---
  // UE model field: content — combines heading, paragraph text, and CTA
  const contentFragment = document.createDocumentFragment();
  contentFragment.appendChild(document.createComment(' field:content '));

  if (heading) {
    // Create a clean h1 with just the text content
    const h1 = document.createElement('h1');
    const headingText = heading.textContent.trim();
    if (headingText) {
      h1.textContent = headingText;
      contentFragment.appendChild(h1);
    }
  }

  // Add paragraphs from the rich text area
  paragraphs.forEach((p) => {
    const text = p.textContent.trim();
    if (text) {
      const para = document.createElement('p');
      para.textContent = text;
      contentFragment.appendChild(para);
    }
  });

  // Add CTA link
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href || ctaLink.getAttribute('href');
    link.textContent = ctaLink.textContent.trim();
    const p = document.createElement('p');
    p.appendChild(link);
    contentFragment.appendChild(p);
  }

  // --- Build col 2: videoUrl (plain text field) ---
  const videoFragment = document.createDocumentFragment();
  videoFragment.appendChild(document.createComment(' field:videoUrl '));

  if (videoUrl) {
    videoFragment.appendChild(document.createTextNode(videoUrl));
  }

  // 1 row × 2 columns: [content, videoUrl] — matches model field order
  const cells = [
    [contentFragment, videoFragment],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
