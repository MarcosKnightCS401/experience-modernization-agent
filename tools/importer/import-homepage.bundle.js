/* eslint-disable */
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1.heading--h1, h1[class*="heading"], h1');
    const richTextContainer = element.querySelector(".rich-text.video-hero-banner__content, .video-hero-banner__content, .rich-text");
    const paragraphs = richTextContainer ? Array.from(richTextContainer.querySelectorAll(":scope > p")) : [];
    const ctaLink = element.querySelector("a.video-hero-banner__cta-button, a.button.video-hero-banner__cta-button, .video-hero-banner__actions a");
    const videoSource = element.querySelector("video.s7videoelement source, video source, source[src]");
    const videoUrl = videoSource ? videoSource.getAttribute("src") : "";
    const contentFragment = document.createDocumentFragment();
    contentFragment.appendChild(document.createComment(" field:content "));
    if (heading) {
      const h1 = document.createElement("h1");
      const headingText = heading.textContent.trim();
      if (headingText) {
        h1.textContent = headingText;
        contentFragment.appendChild(h1);
      }
    }
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text) {
        const para = document.createElement("p");
        para.textContent = text;
        contentFragment.appendChild(para);
      }
    });
    if (ctaLink) {
      const link = document.createElement("a");
      link.href = ctaLink.href || ctaLink.getAttribute("href");
      link.textContent = ctaLink.textContent.trim();
      const p = document.createElement("p");
      p.appendChild(link);
      contentFragment.appendChild(p);
    }
    const videoFragment = document.createDocumentFragment();
    videoFragment.appendChild(document.createComment(" field:videoUrl "));
    if (videoUrl) {
      videoFragment.appendChild(document.createTextNode(videoUrl));
    }
    const cells = [
      [contentFragment, videoFragment]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const buttonDivs = element.querySelectorAll(":scope > div.button");
    const row = [];
    buttonDivs.forEach((btnDiv) => {
      const anchor = btnDiv.querySelector("a");
      if (anchor) {
        const icons = anchor.querySelectorAll("img");
        icons.forEach((icon) => icon.remove());
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.href = anchor.href;
        link.textContent = anchor.textContent.trim();
        p.appendChild(link);
        row.push([p]);
      }
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel.js
  function parse3(element, { document }) {
    const slides = element.querySelectorAll(".carousel__slide:not(.tns-slide-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("a.link, a[href]");
      if (!link) return;
      const img = slide.querySelector("img.image, img");
      const heading = slide.querySelector("h3.heading, h3");
      const col1 = document.createElement("div");
      col1.appendChild(document.createComment(" field:image "));
      if (img) {
        const p = document.createElement("p");
        const pic = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        pic.appendChild(imgClone);
        p.appendChild(pic);
        col1.appendChild(p);
      }
      const col2 = document.createElement("div");
      col2.appendChild(document.createComment(" field:text "));
      if (heading && link.href) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = heading.textContent.trim();
        const h3 = document.createElement("h3");
        h3.appendChild(a);
        col2.appendChild(h3);
      } else if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col2.appendChild(h3);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse4(element, { document }) {
    const cardContainers = element.querySelectorAll(":scope > .container.responsivegrid");
    const cells = [];
    cardContainers.forEach((card) => {
      const img = card.querySelector(".cmp-image__image, img");
      const textLink = card.querySelector(".cmp-text a, .cmp-text p");
      const col1 = document.createElement("div");
      col1.appendChild(document.createComment(" field:image "));
      if (img) {
        const p = document.createElement("p");
        const pic = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        imgClone.removeAttribute("class");
        pic.appendChild(imgClone);
        p.appendChild(pic);
        col1.appendChild(p);
      }
      const col2 = document.createElement("div");
      col2.appendChild(document.createComment(" field:text "));
      if (textLink) {
        const linkClone = textLink.cloneNode(true);
        col2.appendChild(linkClone);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse5(element, { document }) {
    const columnContainers = element.querySelectorAll(":scope > .container.responsivegrid");
    const row = [];
    columnContainers.forEach((col) => {
      const frag = document.createDocumentFragment();
      const heading = col.querySelector("h2, h3");
      if (heading) {
        const h = document.createElement("h2");
        h.textContent = heading.textContent.trim();
        frag.appendChild(h);
      }
      const textEl = col.querySelector(".cmp-text");
      if (textEl) {
        const text = textEl.textContent.trim().replace(/\s+/g, " ");
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          frag.appendChild(p);
        }
      }
      const link = col.querySelector("a.button, a.link");
      if (link) {
        const href = link.getAttribute("href") || "#";
        const fullHref = href.startsWith("/") ? `https://www.zimmerbiomet.com${href}` : href;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = fullHref;
        a.textContent = link.textContent.trim().replace(/\s+/g, " ");
        p.appendChild(a);
        frag.appendChild(p);
      }
      row.push(frag);
    });
    if (row.length === 1) {
      row.push(document.createDocumentFragment());
    }
    const cells = row.length > 0 ? [row] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const cards = element.querySelectorAll(":scope > .news-aggregate-card");
    const cells = [];
    cards.forEach((card) => {
      const anchor = card.querySelector("a.news-aggregate-card");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const img = card.querySelector("header img, .card__header img");
      const tag = card.querySelector(".tag");
      const headline = card.querySelector(".rich-text p, .rich-text");
      const readMore = card.querySelector(".link--utility");
      const col1 = document.createElement("div");
      col1.appendChild(document.createComment(" field:image "));
      if (img) {
        const p = document.createElement("p");
        const pic = document.createElement("picture");
        pic.appendChild(img.cloneNode(true));
        p.appendChild(pic);
        col1.appendChild(p);
      }
      const col2 = document.createElement("div");
      col2.appendChild(document.createComment(" field:text "));
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        col2.appendChild(tagP);
      }
      if (headline) {
        const headlineP = document.createElement("p");
        headlineP.textContent = headline.textContent.trim();
        col2.appendChild(headlineP);
      }
      if (href) {
        const linkP = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = readMore ? readMore.textContent.trim() : "Read more";
        linkP.appendChild(link);
        col2.appendChild(linkP);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse7(element, { document }) {
    const columnContainers = element.querySelectorAll(":scope > .container.responsivegrid");
    const row = [];
    columnContainers.forEach((col) => {
      const frag = document.createDocumentFragment();
      const images = col.querySelectorAll("img");
      let bgImage = null;
      for (const img of images) {
        const src = img.getAttribute("src") || "";
        if (!src.startsWith("data:")) {
          bgImage = img;
          break;
        }
      }
      if (bgImage) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = bgImage.getAttribute("src");
        const alt = bgImage.getAttribute("alt") || "";
        if (alt) imgEl.alt = alt;
        picture.appendChild(imgEl);
        frag.appendChild(picture);
      }
      const heading = col.querySelector("h2, h3");
      if (heading) {
        const h = document.createElement("h2");
        h.textContent = heading.textContent.trim();
        frag.appendChild(h);
      }
      const textEl = col.querySelector(".cmp-text");
      if (textEl) {
        const paragraphs = textEl.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") {
            const para = document.createElement("p");
            para.textContent = text;
            frag.appendChild(para);
          }
        });
      }
      const ctaLink = col.querySelector("a.button");
      if (ctaLink) {
        const href = ctaLink.getAttribute("href") || "#";
        let linkText = "";
        ctaLink.childNodes.forEach((node) => {
          if (node.nodeType === 3) {
            linkText += node.textContent;
          }
        });
        linkText = linkText.trim();
        if (linkText) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = linkText;
          p.appendChild(a);
          frag.appendChild(p);
        }
      }
      row.push(frag);
    });
    const cells = row.length > 0 ? [row] : [];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/zimmerbiomet-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#ot-sdk-btn-floating",
        ".onetrust-pc-dark-filter",
        "[data-acsb-hidden]",
        "[data-acsb-force-hidden]",
        ".acsb-trigger",
        "#acsb-widget"
      ]);
      const paragraphs = element.querySelectorAll("p");
      paragraphs.forEach((p) => {
        if (p.textContent.includes("screen-reader mode") || p.textContent.includes("accessibe.com")) {
          p.remove();
        }
      });
      const imgs = element.querySelectorAll("img");
      imgs.forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("facebook.com/tr") || src.includes("doubleclick.net") || src.includes("liadm.com") || src.includes("sharethis.com")) {
          const picture = img.closest("picture");
          const container = picture ? picture.closest("p") || picture : img.closest("p") || img;
          container.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "header.global-header-v2",
        "footer.global-footer",
        ".mobile-menu",
        ".navigation__mega-menu",
        ".find-a-doctor__cta",
        "iframe",
        "link",
        "noscript"
      ]);
      const allParagraphs = element.querySelectorAll("p");
      allParagraphs.forEach((p) => {
        if (p.textContent.includes("screen-reader mode") || p.textContent.includes("accessibe.com")) {
          p.remove();
        }
      });
      const imgs = element.querySelectorAll("img");
      imgs.forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (src.includes("bat.bing.com") || src.includes("facebook.com/tr") || src.includes("doubleclick.net") || src.includes("liadm.com") || src.includes("sharethis.com")) {
          const picture = img.closest("picture");
          const container = picture ? picture.closest("p") || picture : img.closest("p") || img;
          container.remove();
        }
      });
    }
  }

  // tools/importer/transformers/zimmerbiomet-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "columns": parse2,
    "carousel": parse3,
    "cards-icon": parse4,
    "columns-cta": parse5,
    "cards-news": parse6,
    "columns-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main homepage with hero banner, featured content sections, news highlights, and global navigation entry points",
    urls: [
      "https://www.zimmerbiomet.com/en"
    ],
    blocks: [
      { name: "hero-video", instances: [".video-hero-banner"] },
      { name: "columns", instances: ["#container-378407a0e6"] },
      { name: "carousel", instances: [".generic-carousel"] },
      { name: "cards-icon", instances: ["#container-cc502a8965"] },
      { name: "columns-cta", instances: ["#container-f74e7c38ab"] },
      { name: "cards-news", instances: ["#container-38830d0ee9"] },
      { name: "columns-banner", instances: ["#container-46b580d3ab"] }
    ],
    sections: [
      { id: "section-1", name: "Video Hero Banner", selector: ".video-hero-banner", style: "dark", blocks: ["hero-video"], defaultContent: [] },
      { id: "section-2", name: "Moving You Forward", selector: "#container-89092a7ea4", style: "light-grey", blocks: ["columns"], defaultContent: ["#container-89092a7ea4 h2", "#container-89092a7ea4 h4", "#container-89092a7ea4 h3"] },
      { id: "section-3", name: "Featured Products Carousel", selector: "#container-a4a9cc71fc", style: null, blocks: ["carousel"], defaultContent: ["#container-a4a9cc71fc h3"] },
      { id: "section-4", name: "Areas by Specialty", selector: "#container-f8628a2a1f", style: "light-grey", blocks: ["cards-icon"], defaultContent: ["#container-5430df6d37 h3", "#text-302e7fa406"] },
      { id: "section-5", name: "Education CTA", selector: "#container-f74e7c38ab", style: "dark-blue-gradient", blocks: ["columns-cta"], defaultContent: [] },
      { id: "section-6", name: "In the News", selector: "#container-756e21fce7", style: null, blocks: ["cards-news"], defaultContent: ["#container-756e21fce7 h3"] },
      { id: "section-7", name: "Investor Relations & Careers", selector: "#container-46b580d3ab", style: "dark", blocks: ["columns-banner"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
  return __toCommonJS(import_homepage_exports);
})();
