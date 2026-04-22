/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsCta from './parsers/cards-cta.js';

// TRANSFORMER IMPORTS
import zimmerbiometCleanup from './transformers/zimmerbiomet-cleanup.js';
import zimmerbiometSections from './transformers/zimmerbiomet-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-cta': cardsCta,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'support-page',
  description: 'Support page with customer service resources, contact information, and help documentation',
  urls: [
    'https://www.zimmerbiomet.com/en/support.html',
  ],
  blocks: [
    {
      name: 'cards-cta',
      instances: [
        '#container-745bc00595',
        '#container-63c85c0129',
        '#container-3329b4f645',
        '#container-707c1f120a',
        '#container-7d9288bcec',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title & Introduction',
      selector: 'main .cmp-container > .container:first-child',
      style: null,
      blocks: [],
      defaultContent: ['h1.heading--h1', '#text-1361268311 p'],
    },
    {
      id: 'section-2',
      name: 'Support Cards Row 1',
      selector: '#container-745bc00595',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Support Cards Row 2',
      selector: '#container-63c85c0129',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Support Cards Row 3',
      selector: '#container-3329b4f645',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Support Cards Row 4',
      selector: '#container-707c1f120a',
      style: 'light-grey',
      blocks: ['cards-cta'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Support Cards Row 5',
      selector: '#container-7d9288bcec',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  zimmerbiometCleanup,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [zimmerbiometSections] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.querySelector('main') || document.body;

    // 1. Run cleanup on full body first (removes header, footer, nav outside main)
    executeTransformers('beforeTransform', document.body, payload);

    // Remove everything outside main to strip nav/footer chrome
    if (main !== document.body) {
      document.body.innerHTML = '';
      document.body.appendChild(main);
    }

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
