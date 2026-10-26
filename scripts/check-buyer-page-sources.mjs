#!/usr/bin/env node
/**
 * Buyer-page source contamination check.
 *
 * Bug class this prevents (found 26 Oct 2026 on the live Intersec page): a
 * show page carried another show's source URLs (wetex.ae labelled "Intersec
 * official event page") plus that show's dates/organiser - copy-paste
 * contamination publishing false show facts and fabricated source attribution.
 *
 * Rule: a source URL whose domain contains another show page's distinctive
 * slug token is contamination, unless this page's own slug contains the same
 * token (e.g. gulfood-manufacturing may cite gulfood.com) or the source label
 * declares it co-located. Venue and shared-organiser domains (DWTC, ADNEC,
 * DEC, Messe Frankfurt) are always allowed.
 *
 * Scope: source link/label attribution. It does not verify dates or facts.
 *
 * Run: node scripts/check-buyer-page-sources.mjs  (exit 1 on violation)
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(readFileSync(join(root, 'data', 'buyerPages.json'), 'utf8'));

const GENERIC = new Set(['exhibition','stand','design','dubai','abu','dhabi','contractor','contractors',
  'builder','builders','rental','services','service','company','companies','cost','guide','booth',
  'fit','out','event','events','expo','city','middle','east','global','centre','center','show','uae','gulf','arab']);
const VENUE_TOKENS = ['dwtc','adnec','dubaiexhibitioncentre','expocity'];

const slugTokens = (path) =>
  path.replace(/^\//, '').split('-').filter((t) => t.length >= 4 && !GENERIC.has(t) && !VENUE_TOKENS.includes(t));

// token -> owning page (first wins; duplicates are same-show families)
const tokenOwner = new Map();
for (const path of Object.keys(pages)) {
  for (const t of slugTokens(path)) if (!tokenOwner.has(t)) tokenOwner.set(t, path);
}

const domainOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
};

const isVenuePage = (path) => /dwtc|adnec|expo-city|dubai-exhibition-centre|dec-expo/.test(path);

const violations = [];
for (const [path, page] of Object.entries(pages)) {
  if (isVenuePage(path)) continue; // venue pages legitimately cite the shows they host
  const ownTokens = new Set(slugTokens(path));
  for (const s of page.sources || []) {
    const d = domainOf(s.url || '');
    if (!d) continue;
    if (VENUE_TOKENS.some((v) => d.includes(v))) continue;
    const label = (s.label || '').toLowerCase();
    if (label.includes('co-located')) continue;
    for (const [token, owner] of tokenOwner) {
      if (owner !== path && !ownTokens.has(token) && d.replace(/[^a-z0-9]/g, '').includes(token.replace(/[^a-z0-9]/g, ''))) {
        violations.push(`${path}: source "${(s.label || '').slice(0, 50)}" -> ${d} matches "${token}" (owned by ${owner})`);
      }
    }
  }
}

if (violations.length) {
  console.error('SOURCE CONTAMINATION CHECK FAILED:');
  for (const v of violations) console.error(' -', v);
  process.exit(1);
}
console.log(`OK: ${Object.keys(pages).length} buyer pages scanned, no cross-show source contamination.`);
