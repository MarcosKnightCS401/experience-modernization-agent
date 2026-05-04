/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Zimmer Biomet section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on
 * payload.template.sections from page-templates.json.
 * Runs in afterTransform only.
 * All section selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section) => {
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) return;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> section break before the section element (except for the first section)
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
