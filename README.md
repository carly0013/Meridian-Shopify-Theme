# Meridian

A custom Shopify theme for a luxury/editorial fashion brand — built from scratch, not a modified stock theme.

**Status:** In progress

## Design direction

Editorial and considered, with a dark ink-and-cherry palette: near-black backgrounds, warm cream text, and a single saturated accent color used sparingly (links, small labels, CTA outlines, sale badges). Fraunces carries display/headings, Inter carries everything else, including tracked-uppercase labels in place of a monospace utility face.

A signature `.site-frame` wrapper gives the whole site a persistent picture-frame border — the page background *is* the border color, with content sitting inset at a matching corner radius. The frame stays visible at every scroll position, since `.site-frame` is the scroll container rather than the document itself.

Every color, spacing value, and radius is a theme setting (`config/settings_schema.json`), editable from the Shopify theme editor rather than hardcoded — including the frame border width/color/radius and image corner rounding.

## What's built

- **Homepage** — announcement bar, header with mobile nav, hero with a soft radial accent glow, a lookbook rail, a value bar, a dynamic featured-collection grid, a brand statement section, newsletter signup, and footer. All sections are schema-driven and editable as theme blocks.
- **Header** — mobile nav (with a focus trap and Escape-to-close), a predictive search panel, an account icon, and a live cart-count badge.
- **Search** — predictive suggestions as you type (Section Rendering API), plus a full `/search` results page reusing the product card. Falls back to a plain `/search` request without JS.
- **Product page** — media gallery with thumbnail switching and click-to-zoom, a pill-style variant picker, quantity stepper, price display with sale/compare-at handling, an add-to-cart form, and merchant-editable accordion blocks for shipping/care info. Variant switching (price, media, availability, URL) is progressive enhancement — the page is fully correct without JavaScript.
- **Collection pages** — filtering, sorting, pagination, breadcrumbs, and quick-add on each product card (single-variant products add via AJAX; multi-variant products link through to the PDP). A `/collections` index lists every collection.
- **Cart** — a slide-out drawer for add/update/remove (AJAX, no page reload) plus a full cart page fallback.
- **404 and password pages** — on-brand instead of Shopify's defaults; the password page has an email-capture form and a password-unlock disclosure.
- **Customer accounts** (classic) — login (with an inline forgot-password panel), registration, account overview with order history, order detail, and an address book with add/edit/delete and country/province selection.
- **Blog** — article listing with tag filtering, and an article page with byline, prev/next navigation, and native comments.
- **SEO** — Open Graph, Twitter Card, and JSON-LD (Organization sitewide, Product on PDP).

## Tech

Standard Shopify theme structure (Liquid, JSON templates, theme settings schema). No build step or JS framework — vanilla CSS with custom properties, and small vanilla-JS enhancements loaded only where needed.

```
layout/       theme.liquid (main shell) + password.liquid (pre-launch layout)
templates/    JSON page templates, incl. customers/ for account pages
sections/     schema-driven sections (header, hero, product, etc.)
snippets/     reusable partials (product-card, breadcrumbs, address-form, etc.)
assets/       theme.css + small vanilla-JS files, one per feature area
config/       settings schema + default values
locales/      translation strings
```

## Local development

Requires the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) and a connected store.

```bash
shopify theme dev --store your-store.myshopify.com
shopify theme check
```

Theme Check also runs automatically in GitHub Actions on every push and pull request (`.github/workflows/theme-check.yml`), using the rules in `.theme-check.yml`.
