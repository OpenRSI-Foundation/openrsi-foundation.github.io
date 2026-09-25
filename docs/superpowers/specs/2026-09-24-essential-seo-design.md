# Essential SEO design

## Audience and outcome

This change is for people searching for OpenRSI and for search crawlers trying
to distinguish OpenRSI Foundation and OpenRSI Index from similarly named
projects. The intended outcome is clearer site identity and canonical URLs
without redesigning either site or expanding the content program.

## Scope

### OpenRSI Foundation

- Preserve the current layout and visual hierarchy.
- Add a self-referencing canonical URL and complete Open Graph metadata.
- Add `WebSite` and `Organization` JSON-LD using only verified public links.
- Make the existing hero introduction begin with the exact name
  `OpenRSI Foundation`.
- Add a minimal `robots.txt` and `sitemap.xml`.

### OpenRSI Index

- Preserve the current layout and copy.
- Add a self-referencing canonical URL, `og:url`, and `og:site_name`.
- Serve the Open Graph image from `index.openrsi.foundation` instead of the
  deployment hostname.
- Add `WebSite` JSON-LD that identifies the site as `OpenRSI Index` and links
  it to OpenRSI Foundation.
- Add a minimal `robots.txt` and `sitemap.xml` covering the principal public
  pages.

## Explicitly excluded

- A Chinese-language site or `hreflang` rollout.
- New About, comparison, or disambiguation pages.
- Advisor or team content changes.
- Layout, styling, or JavaScript changes.
- Search Console or DNS changes that require an account-specific verification
  token.
- JavaScript redirects for `/index.html`. GitHub Pages cannot provide a native
  per-path 301 here; canonical tags will consolidate the duplicate URL signal.

## Verification

Each repository will receive a small dependency-free SEO smoke check. The test
must fail against the current files, then pass after implementation. Before
push, validate HTML references, JSON-LD syntax, sitemap XML, git diffs, and the
full smoke checks. After push, verify the deployed files and metadata over
HTTPS.

## Delivery

Create one focused commit per repository and push both commits directly to the
respective `main` branches. Do not modify the separate OpenRSI-Index source
repository.
