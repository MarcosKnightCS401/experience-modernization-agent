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

  // tools/importer/import-generic.js
  var import_generic_exports = {};
  __export(import_generic_exports, {
    default: () => import_generic_default
  });

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

  // tools/importer/import-generic.js
  var PAGE_TEMPLATE = {
    name: "generic",
    description: "Generic content page with cleanup only",
    blocks: [],
    sections: []
  };
  var transformers = [transform];
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
  var import_generic_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.querySelector("main") || document.body;
      executeTransformers("beforeTransform", document.body, payload);
      if (main !== document.body) {
        document.body.innerHTML = "";
        document.body.appendChild(main);
      }
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
          template: PAGE_TEMPLATE.name
        }
      }];
    }
  };
  return __toCommonJS(import_generic_exports);
})();
