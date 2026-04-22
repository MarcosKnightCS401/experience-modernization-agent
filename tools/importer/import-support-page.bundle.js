var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-support-page.js
  var import_support_page_exports = {};
  __export(import_support_page_exports, {
    default: () => import_support_page_default
  });

  // tools/importer/parsers/cards-cta.js
  function parse(element, { document }) {
    const cardElements = element.querySelectorAll(".cta-card > .card");
    const cells = [];
    cardElements.forEach((card) => {
      const header = card.querySelector("header.card__header");
      const link = card.querySelector("a.link");
      const textContainer = document.createDocumentFragment();
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      textContainer.appendChild(document.createComment(" field:text "));
      if (header) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = header.textContent.trim();
        p.appendChild(strong);
        textContainer.appendChild(p);
      }
      if (link) {
        const href = link.getAttribute("href") || "#";
        const fullHref = href.startsWith("/") ? `https://www.zimmerbiomet.com${href}` : href;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = fullHref;
        a.textContent = "Learn more";
        p.appendChild(a);
        textContainer.appendChild(p);
      }
      cells.push([imageCell, textContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/zimmerbiomet-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter",
        // Experience fragments (header, footer, legal disclaimer)
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        // Keep .cmp-experiencefragment--product-pages-legal-disclaimer (authorable content)
        // Global headers (desktop + mobile)
        "header.global-header-v2",
        ".global-header-v2",
        ".global-header--mobile",
        ".global-header--desktop",
        // Navigation elements (all types)
        "nav.navigation",
        "nav.navigation--mobile",
        "nav.navigation--primary",
        "nav.navigation--utility",
        // Mega menu content inside navigation
        ".navigation__mega-menu",
        ".large--border",
        // Sticky container (header chrome)
        ".sticky-container"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "footer.global-footer",
        "div.global-footer",
        ".global-footer--utility",
        ".global-footer--primary-container",
        ".global-footer--info-section",
        "nav.educationEventsLinks",
        "nav.news-room",
        "nav.education-events",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/zimmerbiomet-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-support-page.js
  var parsers = {
    "cards-cta": parse
  };
  var PAGE_TEMPLATE = {
    name: "support-page",
    description: "Support page with customer service resources, contact information, and help documentation",
    urls: [
      "https://www.zimmerbiomet.com/en/support.html"
    ],
    blocks: [
      {
        name: "cards-cta",
        instances: [
          "#container-745bc00595",
          "#container-63c85c0129",
          "#container-3329b4f645",
          "#container-707c1f120a",
          "#container-7d9288bcec"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title & Introduction",
        selector: "main .cmp-container > .container:first-child",
        style: null,
        blocks: [],
        defaultContent: ["h1.heading--h1", "#text-1361268311 p"]
      },
      {
        id: "section-2",
        name: "Support Cards Row 1",
        selector: "#container-745bc00595",
        style: null,
        blocks: ["cards-cta"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Support Cards Row 2",
        selector: "#container-63c85c0129",
        style: null,
        blocks: ["cards-cta"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Support Cards Row 3",
        selector: "#container-3329b4f645",
        style: null,
        blocks: ["cards-cta"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Support Cards Row 4",
        selector: "#container-707c1f120a",
        style: "light-grey",
        blocks: ["cards-cta"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Support Cards Row 5",
        selector: "#container-7d9288bcec",
        style: null,
        blocks: ["cards-cta"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_support_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.querySelector("main") || document.body;
      executeTransformers("beforeTransform", document.body, payload);
      if (main !== document.body) {
        document.body.innerHTML = "";
        document.body.appendChild(main);
      }
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_support_page_exports);
})();
