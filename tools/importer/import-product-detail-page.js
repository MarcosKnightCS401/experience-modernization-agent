/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProduct from './parsers/hero-product.js';

// TRANSFORMER IMPORTS
import zimmerbiometCleanup from './transformers/zimmerbiomet-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProduct,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product-detail-page',
  description: 'Product detail page with hero and rich content sections',
  blocks: [
    {
      name: 'hero-product',
      instances: ['.hero-jump-links'],
    },
  ],
  sections: [],
};

// TRANSFORMER REGISTRY
const transformers = [
  zimmerbiometCleanup,
];

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

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.querySelector('main') || document.body;

    // Run cleanup on full body first
    executeTransformers('beforeTransform', document.body, payload);

    // Scope to main content only
    if (main !== document.body) {
      document.body.innerHTML = '';
      document.body.appendChild(main);
    }

    // Find and parse blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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

    // Final cleanup
    executeTransformers('afterTransform', main, payload);

    // Built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
