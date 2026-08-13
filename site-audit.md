# Site Audit — mark-khoury-portfolio
**Date:** 2026-08-13  
**Auditor:** Claude Code  
**Scope:** Full static-site audit, read-only, no changes made.

---

## 1. Content

### What pages exist
| File | Title | Purpose |
|---|---|---|
| `index.html` | Home | Hero, About, Focus, Gallery, Testimonials |
| `projects.html` | Marketing Projects | 5 project write-ups with downloads/links |
| `resume.html` | Resume | Stats, Education, Experience, Leadership, Skills |
| `awards.html` | Awards & Certifications | Awards grid, academic rankings, 12 certifications |

No Lorem ipsum, no "coming soon" blocks, no broken section headings. Content is authentic and up to date.

---

### Issues

**MODERATE — Misleading gallery image (`index.html` line 320)**  
The gallery card labelled "3. Building the Work" uses `src="images/Canva+For+Real+Estate.webp"`. The filename reveals this is a screenshot of a Canva real-estate tutorial, not your own work. Anyone opening DevTools will see it. Replace with a genuine screenshot or work photo.

**MINOR — Unused images in `/images/`**  
Seven files exist on disk but are never referenced in any HTML:
- `Deans Award.jpeg` (2.2 MB)
- `Herb Gardens.jpeg` (2.8 MB)
- `Concert.avif` (76 KB)
- `Australian Embassy Visit.jpeg` (279 KB)
- `Walk The Field.avif` (96 KB)
- `Social+Media+Profile+Picture+(1).webp` (812 KB)
- `3.jpeg` (12 KB)

Dead weight — confusing to maintain and adds clutter to the repo.

**MINOR — Duplicate resume PDF**  
`Mark_Khoury_Resume.pdf` exists at both the root (147 KB, referenced by `resume.html`) and inside `/images/` (132 KB, unreferenced). Two versions of different sizes suggests one is outdated. Delete `images/Mark_Khoury_Resume.pdf`.

**MINOR — Sitemap `<lastmod>` dates are hardcoded**  
All four URLs in `sitemap.xml` show `2026-04-14`. Pages have been updated since then. Stale `lastmod` is worse than no `lastmod` from Google's perspective. Either update manually after each deploy or remove the field.

---

## 2. Structure / Navigation

### Overall hierarchy
```
/ (Home)
├── projects.html
├── resume.html
└── awards.html
```
Flat, logical, easy to navigate. No redundant pages.

---

### Issues

**MODERATE — Nav, contact section, and footer are copy-pasted across all 4 HTML files**  
The navigation (lines 182–208 of `index.html`), the contact section (lines 407–426), and the footer (lines 428–436) are duplicated verbatim in every page. A change to any of these (e.g. adding a new nav link) must be made in four places. This has already caused one inconsistency:

- In `index.html` the contact `<section>` has `reveal-left` and `reveal-right` classes on its children (lines 409, 414).  
- In `projects.html` those same classes are present (lines 272, 278).  
- In `awards.html` they're present (lines 377, 383).  
- In `resume.html` the contact section has no reveal classes at all (lines 964–971 of footer, but the contact block itself is missing — `resume.html` has no contact section at all).

**MINOR — Logo uses `onclick` instead of an `<a>` tag**  
`<div class="cursor-pointer" onclick="window.location.href='/'">` — present on all 4 pages (e.g. `index.html` line 185). Divs with click handlers are not keyboard-focusable and are invisible to screen readers. Should be `<a href="/">`.

**MINOR — No 404 page**  
Vercel will serve its default generic 404 for any bad URL. A branded 404 page with a link back home is a small, high-value touch for a portfolio.

---

## 3. SEO

### What's in good shape
- All four pages have unique, descriptive `<title>` tags.
- All four pages have `<meta name="description">` tags.
- `robots.txt` and `sitemap.xml` are present and correctly formed.
- Canonical URLs are set on all pages.
- Structured data (`Person` schema + `WebSite` schema on home) is correct.
- `<html lang="en">` is set on all pages.

---

### Issues

**MODERATE — `og:image` uses a relative URL on three pages**  
`projects.html` line 34, `resume.html` line 34, `awards.html` line 34 all have:
```html
<meta property="og:image" content="/images/With%20my%20Graduation%20Certificate.avif" />
```
OpenGraph requires an **absolute** URL. When someone shares these pages on LinkedIn or iMessage, no image will appear. `index.html` correctly uses `https://marklkhoury.com/images/...`. Fix the other three pages to match.

**MODERATE — `twitter:image` is missing on all four pages**  
None of the pages include `<meta name="twitter:image">`. Twitter/X will show a card with no image. Add the same absolute URL used in `og:image`.

**MINOR — Gallery image alt text is not descriptive (`index.html` lines 301, 311, 321, 330, 340, 350)**  
The six gallery images use the section label as alt text ("Where It Starts", "Learning in Motion", etc.). These are captions, not descriptions. Alt text should describe what is visually in the photo for screen readers and image search.

**MINOR — Project image alt text is minimal (`projects.html` lines 164, 187, 210, 236, 261)**  
Alt values like `"Nike Move to Zero"` and `"Marketing Report"` give no visual context. They should describe the actual image content.

---

## 4. Performance

### What's in good shape
- Compiled `output.css` is 18.9 KB (well-purged Tailwind).
- AVIF and WebP formats are used for several images.
- Google Fonts uses `display=swap`.
- Font Awesome CDN link includes SRI integrity hash.

---

### Issues

**CRITICAL — `Goal.jpeg` is 6.9 MB (`index.html` line 351)**  
The original iPhone photo (4032×3024 px, 300 DPI) is served directly. It is displayed in a ~350 px square. The browser must download nearly 7 MB to show a thumbnail. This alone can add 5–10 seconds on a mobile connection.

**CRITICAL — `In Action.jpeg` is 2.8 MB (`index.html` line 331)**  
Same issue. 4032×3024 px iPhone photo displayed at ~350 px wide.

**CRITICAL — `IMG_1049.jpeg` is 1.7 MB (`index.html` line 301)**  
Same issue. Displayed at ~350 px wide.

All three of these images contain full iPhone EXIF metadata including **GPS coordinates** (see §8 Security).

**MODERATE — `Canva+For+Real+Estate.webp` is 770 KB (`index.html` line 321)**  
Displayed at 350 px wide. Needs resizing and re-exporting.

**MODERATE — `IMG_1098.jpeg` is 927 KB (`index.html` line 284)**  
Displayed at full width on desktop but still oversized. Should be resized and converted to AVIF/WebP.

**MODERATE — Three PNG project images should be WebP (`projects.html`)**  
- `Broth_Records_Campaign.png` — 903 KB (line 210)  
- `MARK101_Report_Care_For_A_Slice.png` — 905 KB (line 236)  
- `Ad_Managers_TikTok_Google_Facebook.png` — 556 KB (line 261)  

Converting to WebP at equivalent quality typically saves 30–60%.

**MODERATE — No `loading="lazy"` on below-the-fold images**  
None of the `<img>` tags in the gallery, projects, or resume sections use `loading="lazy"`. All images load on page initialisation regardless of whether they're in the viewport.

**MODERATE — No `width` and `height` attributes on most `<img>` tags**  
Without explicit dimensions the browser can't reserve space before images load, causing layout shift (CLS). This directly impacts Core Web Vitals scores.

**MINOR — Full Font Awesome loaded for ~15 icons used**  
`all.min.css` (~30 KB gzipped) is loaded from cdnjs. Only a handful of icons (`fa-bars`, `fa-linkedin`, `fa-instagram`, `fa-youtube`, `fa-bullhorn`, `fa-file-download`, `fa-play`, etc.) are actually used. An SVG sprite or individual icon imports would be significantly smaller.

**MINOR — Unused Tailwind animation in `tailwind.config.js`**  
`tailwind.config.js` lines 9–17 define a `scroll-slow` animation and `scroll` keyframes that are not applied in any HTML file. This adds unused CSS to `output.css` (Tailwind only purges utility classes, not named animations/keyframes that are defined in config `extend`).

---

## 5. Accessibility

**MODERATE — Mobile hamburger button has no `aria-label` and actively removes focus ring**  
All four pages (e.g. `index.html` line 197):
```html
<button class="md:hidden text-gray-800 focus:outline-none" onclick="toggleMobileMenu()">
    <i class="fas fa-bars text-xl"></i>
</button>
```
Two issues: (1) No `aria-label="Open menu"` so screen readers announce "button" with no context. (2) `focus:outline-none` removes the visible focus indicator for keyboard users, failing WCAG 2.4.7.

**MODERATE — Mobile menu button has no `aria-expanded` state**  
The button doesn't communicate open/closed state to assistive technology. Add `aria-expanded="false"` and toggle it in `toggleMobileMenu()`.

**MODERATE — Footer social icon links have no accessible label**  
All four pages (e.g. `index.html` lines 431–433):
```html
<a href="https://www.linkedin.com/in/..." ...><i class="fab fa-linkedin text-xl"></i></a>
```
An icon with no text and no `aria-label` is announced as an unlabelled link by screen readers. Add `aria-label="LinkedIn"`, `aria-label="Instagram"`, `aria-label="YouTube"` to each.

**MODERATE — Contact form inputs have no `<label>` elements (all pages)**  
All form fields use `placeholder` as the only text descriptor (e.g. `index.html` lines 417–421). Placeholders disappear on focus, provide no persistent label, and are not reliably read by screen readers. Each input needs an associated `<label>` (visible or visually hidden with `sr-only`).

**MINOR — No `prefers-reduced-motion` media query**  
The site uses extensive animation (hero word-by-word, scroll reveals, clip-path transitions, border growth). Users who have set "Reduce Motion" in their OS settings receive the full animation load regardless. Add:
```css
@media (prefers-reduced-motion: reduce) {
    .hero-word, .reveal, .reveal-left, .reveal-right,
    .reveal-scale, .clip-reveal-inner, .border-animate::before {
        animation: none;
        transition: none;
        opacity: 1;
        transform: none;
    }
}
```

---

## 6. Mobile Responsiveness

### What's in good shape
- Responsive nav with working mobile hamburger menu.
- Two-column layouts correctly collapse to single column.
- Stats strip on Resume page collapses 4→2→1 columns correctly.
- Font sizes use `clamp()` on Resume hero.
- Certifications grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` scales well.

---

### Issues

**MINOR — Awards main grid uses `lg:grid-cols-5` (`awards.html` line 141)**  
Five columns on large screens with cards like "Business Undergraduate Academic Excellence Scholarship" as the heading. On mid-sized laptops (1024–1280 px) these cards can become very narrow with wrapping multi-line headings. Consider `lg:grid-cols-3 xl:grid-cols-5` or reducing to 4.

**MINOR — Project card images have a fixed `h-48` on mobile (`projects.html` e.g. line 161)**  
`class="... h-48 md:h-64 ..."` — fixed height can cause awkward cropping on portrait images at certain viewport widths. `aspect-video` or `aspect-square` with `object-cover` would be more predictable.

---

## 7. Code Quality

**MODERATE — IntersectionObserver is duplicated across all four pages**  
The scroll-reveal observer block is written separately in each HTML file (often as both an IIFE and a named script). It is identical logic repeated four times. Moving it to a shared `js/reveal.js` would make it maintainable.

**MODERATE — All animation CSS is duplicated across all four `<style>` blocks**  
The `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, `.clip-reveal`, `@keyframes heroUp`, `.hero-word`, `.d1`–`.d6`, and `:root { --spring }` declarations appear in full in every page's inline `<style>`. This is ~80 lines of CSS × 4 pages. Centralise in `input.css` (which is passed through Tailwind) or a shared `base.css`.

**MODERATE — Logo navigation uses inline `onclick` on a `<div>` (all pages)**  
`onclick="window.location.href='/'"` — as noted in §2. Poor pattern; use an `<a>` tag.

**MINOR — `package.json` has blank `author` field (line 16)**  
```json
"author": "",
```
Should be `"Mark Khoury"`.

**MINOR — `console.error('Email error:', error)` in `api/contact.js` line 85**  
This is server-side and appropriate — Vercel will capture it in function logs. Not a problem, but flagged for completeness. The error details are correctly not exposed to the client.

**MINOR — No `aria-label` on the mobile menu `<div>` itself**  
The `#mobile-menu` div could include `role="navigation"` and `aria-label="Mobile menu"` for assistive technology.

---

## 8. Security

### What's in good shape
- `GMAIL_USER` and `GMAIL_PASS` are loaded from `process.env` — no credentials in source code.
- `.env`, `.env.local`, `.env.production` are listed in `.gitignore` and are not committed.
- `node_modules` is gitignored and not committed.
- `api/contact.js` validates required fields, email format, and length limits.
- HTML output is escaped via `escapeHtml()` before being put into the email body.
- `vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy` on all responses — solid baseline.

---

### Issues

**CRITICAL — In-memory rate limiter is non-functional on Vercel serverless**  
`api/contact.js` lines 4–29: the `rateLimitMap` is a module-level `Map`. On Vercel, each function invocation may run in a fresh isolate (cold start), meaning the map is empty on every request. The rate limit effectively does nothing in production — a spammer can submit the contact form as fast as they like without being throttled. Fix options: use Vercel KV, Upstash Redis, or a simple server-side token in a durable store.

**MODERATE — JPEG images contain GPS coordinates (EXIF data)**  
The following images were shot on an iPhone and their EXIF metadata includes `GPS-Data`:
- `images/Goal.jpeg` — shot 2025-11-25
- `images/In Action.jpeg` — shot 2025-01-28
- `images/IMG_1049.jpeg` — shot 2026-01-26

GPS coordinates embedded in photos served from your public website reveal the location where each photo was taken. Strip EXIF data (using ImageOptim, exiftool, or sharp during build) before deploying.

**MINOR — CSP allows `'unsafe-inline'` for both scripts and styles**  
`vercel.json` line 21: the Content-Security-Policy includes `'unsafe-inline'` in both `script-src` and `style-src`. This is required by the inline `<script>` tags in all four HTML files (GA snippet, IntersectionObserver) and by Tailwind's inline styles. The policy still protects against injected external scripts, but a nonce-based CSP would be stronger. Low priority for a static portfolio, but worth knowing.

**MINOR — `google522b04faaa0f9bba.html` is committed and served publicly**  
This is the Google Search Console HTML verification file. It is intentional, public, and not sensitive — but worth noting that it's a permanent fixture in the repo and the file name contains your GSC token.

---

## Summary Table

| # | Severity | Area | Issue |
|---|---|---|---|
| 1 | Critical | Performance | `Goal.jpeg` is 6.9 MB (iPhone photo served at thumbnail size) |
| 2 | Critical | Performance | `In Action.jpeg` is 2.8 MB (same problem) |
| 3 | Critical | Performance | `IMG_1049.jpeg` is 1.7 MB (same problem) |
| 4 | Critical | Security | In-memory rate limiter is non-functional in Vercel serverless |
| 5 | Moderate | Security | GPS coordinates in EXIF data of 3 JPEG images |
| 6 | Moderate | SEO | `og:image` is a relative URL on projects, resume, awards pages |
| 7 | Moderate | SEO | `twitter:image` missing on all four pages |
| 8 | Moderate | Performance | 3 large PNG project images (903/905/556 KB) should be WebP |
| 9 | Moderate | Performance | No `loading="lazy"` on below-fold images |
| 10 | Moderate | Performance | No `width`/`height` on `<img>` tags (layout shift / CLS) |
| 11 | Moderate | Accessibility | Hamburger button has no `aria-label` and removes focus ring |
| 12 | Moderate | Accessibility | No `aria-expanded` on mobile menu button |
| 13 | Moderate | Accessibility | Footer social links are icon-only with no accessible label |
| 14 | Moderate | Accessibility | Contact form inputs have no `<label>` elements |
| 15 | Moderate | Code quality | Nav, contact, footer, CSS, and observer duplicated across 4 files |
| 16 | Moderate | Content | Gallery "Building the Work" uses a Canva tutorial screenshot |
| 17 | Minor | SEO | Gallery/project image alt text is not descriptive |
| 18 | Minor | Accessibility | No `prefers-reduced-motion` media query |
| 19 | Minor | Content | 7 unused images in `/images/` (~4.3 MB of dead weight) |
| 20 | Minor | Content | Duplicate `Mark_Khoury_Resume.pdf` (root vs images/) |
| 21 | Minor | Content | Sitemap `<lastmod>` hardcoded and stale |
| 22 | Minor | Structure | Logo uses `onclick` on a `<div>` instead of `<a>` tag |
| 23 | Minor | Structure | No custom 404 page |
| 24 | Minor | Performance | `Canva+For+Real+Estate.webp` is 770 KB for a thumbnail |
| 25 | Minor | Performance | `IMG_1098.jpeg` is 927 KB, unoptimised |
| 26 | Minor | Performance | Full Font Awesome loaded for ~15 icons |
| 27 | Minor | Performance | Unused `scroll-slow` animation in `tailwind.config.js` |
| 28 | Minor | Code quality | `package.json` `author` field is blank |
| 29 | Minor | Security | CSP uses `'unsafe-inline'` (required for current architecture, but noted) |
