#!/usr/bin/env node
/**
 * Buyer-page source contamination check.
 *
 * Bug class this prevents (found 26 Oct 2026): the Intersec show page carried
 * WETEX's source URLs (wetex.ae labelled "Intersec official event page") and
 * WETEX dates/organiser in an FAQ - a copy-paste contamination that published
 * false show facts and fabricated source attribution.
 *
 * Rule: a domain used in exactly ONE show page's sources is that show's
 * organiser domain; no other page may cite it in sources, FAQs or dated
 * sections. Domains shared by multiple pages (venues, regulators, co-located
 * shows) are allowed.
 *
 * Run: node scripts/check-buyer-page-sources.mjs  (exit 1 on violation)
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(readFileSync(join(root, 'data', 'buyerPages.json'), 'utf8'));

const domainOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
};

// 1. Map domain -> set of pages citing it in sources.
const domainPages = new Map();
for (const [path, page] of Object.entries(pages)) {
  for (const s of page.sources || []) {
    const d = domainOf(s.url || '');
    if (!d) continue;
    if (!domainPages.has(d)) domainPages.set(d, new Set());
    domainPages.get(d).add(path);
  }
}

// 2. Exclusive organiser domains = cited by exactly one page.
const exclusive = new Map(); // domain -> owning page
for (const [d, set] of domainPages) if (set.size === 1) exclusive.set(d, [...set][0]);

// 3. No page may reference another page's exclusive organiser domain anywhere.
const violations = [];
for (const [path, page] of Object.entries(pages)) {
  const blob = JSON.stringify(page);
  for (const [d, owner] of exclusive) {
    if (owner !== path && blob.includes(d)) {
      violations.push(`${path} references exclusive organiser domain ${d} (owned by ${owner})`);
    }
  }
}

if (violations.length) {
  console.error('SOURCE CONTAMINATION CHECK FAILED:');
  for (const v of violations) console.error(' -', v);
  process.exit(1);
}
console.log(`OK: ${Object.keys(pages).length} buyer pages, ${exclusive.size} exclusive organiser domains, no cross-page contamination.`);
