/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProduct from './parsers/hero-product.js';
import cardsCta from './parsers/cards-cta.js';
import columnsCta from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import zimmerbiometCleanup from './transformers/zimmerbiomet-cleanup.js';
import zimmerbiometSections from './transformers/zimmerbiomet-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProduct,
  'cards-cta': cardsCta,
  'columns-cta': columnsCta,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'specialty-landing-page',
  description: 'Specialty product landing page with hero, content sections, product cards, and CTA columns',
  urls: [
    'https://www.zimmerbiomet.com/en/products-and-solutions/specialties/orthogrid.html',
  ],
  blocks: [
    {
      name: 'hero-product',
      instances: ['.hero-jump-links'],
    },
    {
      name: 'cards-cta',
      instances: ['#container-b203b9c61f'],
    },
    {
      name: 'columns-cta',
      instances: ['#container-e9dd4bdb75'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.hero-jump-links',
      style: 'dark',
      blocks: ['hero-product'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Content - Digital Revolution',
      selector: '#01-Robotics',
      style: null,
      blocks: [],
      defaultContent: ['#01-Robotics h2', '#text-c6bd20be2b'],
    },
    {
      id: 'section-3',
      name: 'Product Cards',
      selector: '#container-b203b9c61f',
      style: null,
      blocks: ['cards-cta'],
      defaultContent: ['#container-b203b9c61f > .title h3'],
    },
    {
      id: 'section-4',
      name: 'CTA Columns',
      selector: '#container-e9dd4bdb75',
      style: 'dark',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'References',
      selector: '.expand',
      style: null,
      blocks: [],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  zimmerbiometCleanup,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [zimmerbiometSections] : []),
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

    // Final cleanup + section breaks
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
