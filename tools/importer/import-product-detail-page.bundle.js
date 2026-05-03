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

  // tools/importer/import-product-detail-page.js
  var import_product_detail_page_exports = {};
  __export(import_product_detail_page_exports, {
    default: () => import_product_detail_page_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1");
    const subtitle = element.querySelector("h5, .heading--h5");
    const image = element.querySelector('img.hero-jump-links__mobile-photo-inline, img[alt="Hero photo"]');
    const cells = [];
    if (image) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt || "";
      pic.appendChild(img);
      imgFrag.appendChild(pic);
      cells.push([imgFrag]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textFrag.appendChild(h1);
    }
    if (subtitle) {
      const text = subtitle.textContent.trim().replace(/\s+/g, " ");
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        textFrag.appendChild(p);
      }
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
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

  // tools/importer/import-product-detail-page.js
  var parsers = {
    "hero-product": parse
  };
  var PAGE_TEMPLATE = {
    name: "product-detail-page",
    description: "Product detail page with hero and rich content sections",
    blocks: [
      {
        name: "hero-product",
        instances: [".hero-jump-links"]
      }
    ],
    sections: []
  };
  var transformers = [
    transform
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
  var import_product_detail_page_default = {
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
  return __toCommonJS(import_product_detail_page_exports);
})();
