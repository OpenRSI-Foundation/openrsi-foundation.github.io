# Essential SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the minimum crawl, canonical, and brand-identity signals needed for OpenRSI Foundation and OpenRSI Index without changing either site's layout.

**Architecture:** Both repositories are static GitHub Pages sites. Each site receives self-contained metadata in its existing `index.html`, static crawler files at the repository root, and a dependency-free shell smoke test that verifies the required production artifacts.

**Tech Stack:** Static HTML, JSON-LD, XML sitemap, robots.txt, POSIX shell, Node.js for JSON parsing, GitHub Pages.

---

### Task 1: OpenRSI Foundation SEO contract

**Files:**
- Create: `tests/seo-smoke.sh`
- Modify: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`

- [ ] **Step 1: Write the failing smoke test**

Create `tests/seo-smoke.sh` with strict shell settings and checks for the exact
canonical URL, Open Graph identity, JSON-LD types, branded hero sentence,
robots sitemap declaration, and sitemap homepage URL. Extract every JSON-LD
block with Node.js and parse it with `JSON.parse`.

- [ ] **Step 2: Run the test and verify RED**

Run: `sh tests/seo-smoke.sh`

Expected: non-zero exit because the current page has no canonical URL.

- [ ] **Step 3: Add the minimal production metadata**

Add the following identity signals inside `<head>`:

```html
<link rel="canonical" href="https://openrsi.foundation/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OpenRSI Foundation">
<meta property="og:title" content="OpenRSI Foundation — Make RSI Benefit Everyone">
<meta property="og:description" content="Open research, shared tools, and a community advancing recursive self-improvement. Explore OpenRSI Index and meet our advisors.">
<meta property="og:url" content="https://openrsi.foundation/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://openrsi.foundation/#website",
      "url": "https://openrsi.foundation/",
      "name": "OpenRSI Foundation",
      "alternateName": ["OpenRSI", "openrsi.foundation"],
      "publisher": {"@id": "https://openrsi.foundation/#organization"}
    },
    {
      "@type": "Organization",
      "@id": "https://openrsi.foundation/#organization",
      "url": "https://openrsi.foundation/",
      "name": "OpenRSI Foundation",
      "logo": "https://openrsi.foundation/brand-mark.svg",
      "sameAs": ["https://github.com/OpenRSI-Foundation"]
    }
  ]
}
</script>
```

Change only the hero introduction sentence to begin with the exact brand name:

```html
<p class="intro">OpenRSI Foundation brings researchers and communities together to keep recursive self-improvement open—and make its benefits shared.</p>
```

Create `robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://openrsi.foundation/sitemap.xml
```

Create `sitemap.xml` with the homepage as its single canonical URL.

- [ ] **Step 4: Verify GREEN**

Run: `sh tests/seo-smoke.sh`

Expected: `Foundation SEO smoke checks passed.` and exit 0.

- [ ] **Step 5: Commit the Foundation changes**

```bash
git add index.html robots.txt sitemap.xml tests/seo-smoke.sh
git commit -m "Add essential Foundation SEO metadata"
```

### Task 2: OpenRSI Index SEO contract

**Files:**
- Create: `tests/seo-smoke.sh`
- Modify: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`

- [ ] **Step 1: Write the failing smoke test**

Create a dependency-free shell test that verifies the exact canonical URL,
`og:site_name`, `og:url`, the first-party OG image, valid `WebSite` JSON-LD,
the robots sitemap declaration, and the five principal sitemap URLs.

- [ ] **Step 2: Run the test and verify RED**

Run: `sh tests/seo-smoke.sh`

Expected: non-zero exit because the current page has no canonical URL.

- [ ] **Step 3: Add the minimal production metadata**

Add the following to `index.html`:

```html
<link rel="canonical" href="https://index.openrsi.foundation/">
<meta property="og:site_name" content="OpenRSI Index">
<meta property="og:url" content="https://index.openrsi.foundation/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://index.openrsi.foundation/#website",
  "url": "https://index.openrsi.foundation/",
  "name": "OpenRSI Index",
  "publisher": {
    "@type": "Organization",
    "@id": "https://openrsi.foundation/#organization",
    "name": "OpenRSI Foundation",
    "url": "https://openrsi.foundation/"
  }
}
</script>
```

Replace the OG image URL with:

```html
<meta property="og:image" content="https://index.openrsi.foundation/assets/og.png">
```

Create `robots.txt` with the Index sitemap URL. Create `sitemap.xml` containing
the canonical URLs for `/`, `/tasks.html`, `/blog/introducing-rsi-index.html`,
`/contribute.html`, and `/team.html`.

- [ ] **Step 4: Verify GREEN**

Run: `sh tests/seo-smoke.sh`

Expected: `Index SEO smoke checks passed.` and exit 0.

- [ ] **Step 5: Commit the Index changes**

```bash
git add index.html robots.txt sitemap.xml tests/seo-smoke.sh
git commit -m "Add essential Index SEO metadata"
```

### Task 3: Pre-push and live verification

**Files:**
- Verify all files changed in Tasks 1 and 2.

- [ ] **Step 1: Run local verification in both repositories**

Run each smoke test, `git diff --check`, parse each sitemap with an XML parser,
and confirm only the planned files changed.

- [ ] **Step 2: Push both `main` branches**

Push the Foundation repository first, then the Index repository. Do not force
push and do not rewrite existing history.

- [ ] **Step 3: Verify GitHub Pages deployment**

Fetch both live homepages, `robots.txt`, and `sitemap.xml`. Confirm HTTP 200 and
the expected canonical, JSON-LD, crawler declarations, and first-party OG image.

- [ ] **Step 4: Record the account-specific follow-up**

Report that Google Search Console domain verification, sitemap submission, and
request-indexing remain account-specific follow-up actions because no Google
verification token or verified Search Console property is part of the codebase.
