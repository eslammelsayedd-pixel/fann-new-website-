// Post-build: write a static HTML file per route with its own title, meta, canonical,
// JSON-LD and a text version of the page content, so crawlers and link previews see
// real page content before JavaScript runs. React replaces #root content on load.
// Regenerate scripts/prerender-routes.json after changing page copy (see scripts/README).
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://fann.ae';
const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const routes = JSON.parse(fs.readFileSync(path.resolve('scripts/prerender-routes.json'), 'utf8'));
const fitOutReferences = JSON.parse(fs.readFileSync(path.resolve('data/fitOutReferences.json'), 'utf8'));
// Keep the server-rendered fit-out reference pages in sync with the approved reference data.
for (const item of fitOutReferences) {
  const route = `/portfolio/${item.slug}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: item.name,
    description: item.description, url: SITE + route, about: item.sector,
    image: item.images.map(image => SITE + image), dateCreated: item.year, contentLocation: { '@type': 'Place', name: item.emirate },
  };
  const text = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  routes[route] = {
    title: `${item.name} | ${item.emirate} Project Reference | FANN`,
    description: item.description,
    robots: 'index, follow',
    jsonld: JSON.stringify(schema),
    body: `<main><nav><a href="/portfolio">Back to portfolio</a></nav><p>Interior fit-out &amp; renovation · Project reference</p><h1>${text(item.name)}</h1><p>Location: ${text(item.emirate)}, UAE</p><p>Sector: ${text(item.sector)}</p><p>Year: ${text(item.year)}</p><h2>Project overview</h2><p>${text(item.description)}</p>${item.images.map((image, index) => `<img src="${text(image)}" alt="${text(item.name)} - photo ${index + 1}" loading="lazy">`).join('')}${item.area ? `<p>Area: ${text(item.area)} sq ft.</p>` : ''}<a href="/portfolio">Explore more projects</a><a href="/contact">Discuss a fit-out project</a></main>`,
  };
}
// Keep the portfolio's crawler view in sync with real project names and photo covers.
const escapePortfolio = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portfolioRoute = routes['/portfolio'];
portfolioRoute.body = `<main><h1>FANN Portfolio</h1><h2>Fit-out and renovation projects</h2>${fitOutReferences.map(item => `<article><a href="/portfolio/${item.slug}"><img src="${escapePortfolio(item.images[0])}" alt="${escapePortfolio(item.name)}" loading="lazy"><h3>${escapePortfolio(item.name)}</h3></a><p>${escapePortfolio(item.emirate)} · ${escapePortfolio(item.sector)} · ${item.area ? escapePortfolio(item.area) + ' sq ft' : 'Area not disclosed'} · ${item.year}</p></article>`).join('')}<a href="/portfolio/icons-of-porsche-2025-dubai">Icons of Porsche</a><a href="/portfolio/national-expression-adek-abu-dhabi">National Expression, ADEK</a><a href="/contact">Discuss your project</a></main>`;
portfolioRoute.jsonld = JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'FANN Portfolio',url:SITE+'/portfolio',mainEntity:{'@type':'ItemList',numberOfItems:fitOutReferences.length,itemListElement:fitOutReferences.map((item,index)=>({'@type':'ListItem',position:index+1,url:SITE+'/portfolio/'+item.slug,name:item.name,image:SITE+item.images[0]}))}});
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const [route, r] of Object.entries(routes)) {
  const url = SITE + (route === '/' ? '/' : route);
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`);
  html = html.replace(/<meta name="description"[^>]*>/, '');
  html = html.replace(/<meta property="og:(title|description|url)"[^>]*>/g, '');
  html = html.replace(/<meta name="twitter:(title|description)"[^>]*>/g, '');
  const head = [
    `<meta name="description" content="${esc(r.description)}">`,
    `<meta name="robots" content="${esc(r.robots || 'index, follow')}">`,
    `<meta property="og:title" content="${esc(r.title)}">`,
    `<meta property="og:description" content="${esc(r.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta name="twitter:title" content="${esc(r.title)}">`,
    `<meta name="twitter:description" content="${esc(r.description)}">`,
    ...(r.jsonld ? [`<script id="json-ld-schema" type="application/ld+json">${r.jsonld.replace(/<\//g, '<\\/')}</script>`] : []),
  ].join('\n    ');
  html = html.replace('</head>', `    ${head}\n  </head>`);
  html = html.replace(/<div id="root"><\/div>/, `<div id="root"><main class="prerender">${r.body}</main></div>`);
  const out = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}
console.log(`prerendered ${Object.keys(routes).length} routes`);
