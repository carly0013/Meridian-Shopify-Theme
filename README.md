# Meridian

A custom Shopify theme for a luxury/editorial fashion brand — built from scratch, not a modified stock theme.

**Status:** In progress

## Design direction

Editorial and considered, with a dark ink-and-cherry palette: near-black backgrounds, warm cream text, and a single saturated accent color used sparingly (links, small labels, CTA outlines, sale badges). Fraunces carries display/headings, Inter carries everything else, including tracked-uppercase labels in place of a monospace utility face.

A signature `.site-frame` wrapper gives the whole site a persistent picture-frame border — the page background *is* the border color, with content sitting inset at a matching corner radius. The frame stays visible at every scroll position, since `.site-frame` is the scroll container rather than the document itself.

Every color, spacing value, and radius is a theme setting (`config/settings_schema.json`), editable from the Shopify theme editor rather than hardcoded — including the frame border width/color/radius and image corner rounding.

## What's built

- **Homepage** — announcement bar, header with mobile nav, hero with a soft radial accent glow, a lookbook rail, a dynamic featured-collection grid, a brand statement section, newsletter signup, and footer. All sections are schema-driven and editable as theme blocks.
- **Product page** — media gallery with thumbnail switching, a pill-style variant picker, quantity stepper, price display with sale/compare-at handling, an add-to-cart form, and merchant-editable accordion blocks for shipping/care info. Variant switching (price, media, availability, URL) is progressive enhancement — the page is fully correct without JavaScript.
- **Cart** — header cart icon with a live item-count badge.

## Tech

Standard Shopify theme structure (Liquid, JSON templates, theme settings schema). No build step or JS framework — vanilla CSS with custom properties, and small vanilla-JS enhancements loaded only where needed.

```
layout/       theme shell (head, fonts, site-frame wrapper, header/footer includes)
templates/    JSON page templates
sections/     schema-driven sections (header, hero, product, etc.)
assets/       theme.css, theme.js, product-form.js
config/       settings schema + default values
locales/      translation strings
```

## Local development

Requires the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) and a connected store.

```bash
shopify theme dev --store your-store.myshopify.com
shopify theme check
```
