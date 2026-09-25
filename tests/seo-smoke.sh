#!/bin/sh
set -eu

assert_contains() {
  file=$1
  expected=$2
  if ! grep -Fq "$expected" "$file"; then
    echo "Missing in $file: $expected" >&2
    exit 1
  fi
}

assert_contains index.html '<link rel="canonical" href="https://openrsi.foundation/">'
assert_contains index.html '<meta property="og:site_name" content="OpenRSI Foundation">'
assert_contains index.html '<meta property="og:url" content="https://openrsi.foundation/">'
assert_contains index.html 'OpenRSI Foundation brings researchers and communities together'

node <<'NODE'
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
if (blocks.length !== 1) throw new Error(`Expected one JSON-LD block, found ${blocks.length}`);
const data = JSON.parse(blocks[0][1]);
const graph = data['@graph'];
if (!Array.isArray(graph)) throw new Error('Expected JSON-LD @graph');
if (!graph.some((item) => item['@type'] === 'WebSite' && item.name === 'OpenRSI Foundation')) {
  throw new Error('Missing OpenRSI Foundation WebSite entity');
}
if (!graph.some((item) => item['@type'] === 'Organization' && item.name === 'OpenRSI Foundation')) {
  throw new Error('Missing OpenRSI Foundation Organization entity');
}
NODE

assert_contains robots.txt 'Sitemap: https://openrsi.foundation/sitemap.xml'
assert_contains sitemap.xml '<loc>https://openrsi.foundation/</loc>'

echo 'Foundation SEO smoke checks passed.'
