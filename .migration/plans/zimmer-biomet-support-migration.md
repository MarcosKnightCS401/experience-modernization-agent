# Migration Plan: Zimmer Biomet Support Page

**Source URL:** https://www.zimmerbiomet.com/en/support.html
**Target:** AEM Edge Delivery Services (xwalk project)
**Project type:** Universal Editor (xwalk) with block library

---

## Current Workspace State

- **Project type:** xwalk (Universal Editor / AEM Sites authoring)
- **Block library:** `https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json`
- **Existing blocks:** cards, columns, fragment, hero, header, footer
- **Existing content:** Only boilerplate demo content (`index.plain.html`)
- **No page templates or metadata files** exist yet — these will be created during migration

---

## Migration Approach

This migration will use the **excat-site-migration** skill, which provides:
- Automated page analysis (structure, sections, block identification)
- Block variant tracking and intelligent reuse
- Import infrastructure generation (parsers, transformers, import script)
- Content file generation (HTML output for EDS)
- Metadata management

---

## Checklist

- [ ] **Site analysis** — Create page template skeleton for the support page URL pattern
- [ ] **Page analysis** — Analyze https://www.zimmerbiomet.com/en/support.html for content structure, sections, and block variants
- [ ] **Block mapping** — Map identified content sections to EDS blocks (existing or new variants)
- [ ] **Block variant creation** — Create any new block variants needed (JS + CSS + model JSON)
- [ ] **Import infrastructure** — Generate block parsers, page transformers, and import script
- [ ] **Content import** — Execute import script to generate HTML content file
- [ ] **Preview verification** — Validate rendered output in local preview server
- [ ] **Visual comparison** — Compare migrated page against original for fidelity

---

## Key Considerations

- **xwalk project requirements:** Block model JSON files (`_blockname.json`) must be created for any new blocks/variants to support Universal Editor authoring
- **Design tokens:** Global styles may need updates if the Zimmer Biomet design system differs significantly from the boilerplate
- **Images:** Will reference source URLs during migration (not downloaded locally)

---

> **To proceed:** Switch to Execute mode and the `excat-site-migration` skill will orchestrate the full migration workflow.
