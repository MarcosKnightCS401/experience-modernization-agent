/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import columnsParser from './parsers/columns.js';
import carouselParser from './parsers/carousel.js';
import cardsIconParser from './parsers/cards-icon.js';
import columnsCtaParser from './parsers/columns-cta.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsBannerParser from './parsers/columns-banner.js';

import cleanupTransformer from './transformers/zimmerbiomet-cleanup.js';
import sectionsTransformer from './transformers/zimmerbiomet-sections.js';

const parsers = {
  'hero-video': heroVideoParser,
  'columns': columnsParser,
  'carousel': carouselParser,
  'cards-icon': cardsIconParser,
  'columns-cta': columnsCtaParser,
  'cards-news': cardsNewsParser,
  'columns-banner': columnsBannerParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main homepage with hero banner, featured content sections, news highlights, and global navigation entry points',
  urls: [
    'https://www.zimmerbiomet.com/en',
  ],
  blocks: [
    { name: 'hero-video', instances: ['.video-hero-banner'] },
    { name: 'columns', instances: ['#container-378407a0e6'] },
    { name: 'carousel', instances: ['.generic-carousel'] },
    { name: 'cards-icon', instances: ['#container-cc502a8965'] },
    { name: 'columns-cta', instances: ['#container-f74e7c38ab'] },
    { name: 'cards-news', instances: ['#container-38830d0ee9'] },
    { name: 'columns-banner', instances: ['#container-46b580d3ab'] },
  ],
  sections: [
    { id: 'section-1', name: 'Video Hero Banner', selector: '.video-hero-banner', style: 'dark', blocks: ['hero-video'], defaultContent: [] },
    { id: 'section-2', name: 'Moving You Forward', selector: '#container-89092a7ea4', style: 'light-grey', blocks: ['columns'], defaultContent: ['#container-89092a7ea4 h2', '#container-89092a7ea4 h4', '#container-89092a7ea4 h3'] },
    { id: 'section-3', name: 'Featured Products Carousel', selector: '#container-a4a9cc71fc', style: null, blocks: ['carousel'], defaultContent: ['#container-a4a9cc71fc h3'] },
    { id: 'section-4', name: 'Areas by Specialty', selector: '#container-f8628a2a1f', style: 'light-grey', blocks: ['cards-icon'], defaultContent: ['#container-5430df6d37 h3', '#text-302e7fa406'] },
    { id: 'section-5', name: 'Education CTA', selector: '#container-f74e7c38ab', style: 'dark-blue-gradient', blocks: ['columns-cta'], defaultContent: [] },
    { id: 'section-6', name: 'In the News', selector: '#container-756e21fce7', style: null, blocks: ['cards-news'], defaultContent: ['#container-756e21fce7 h3'] },
    { id: 'section-7', name: 'Investor Relations & Careers', selector: '#container-46b580d3ab', style: 'dark', blocks: ['columns-banner'], defaultContent: [] },
  ],
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
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
