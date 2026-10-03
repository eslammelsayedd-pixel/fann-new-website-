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
// Contextual Abu Dhabi exhibition path is also available before JavaScript loads.
routes['/'].body += '<section><h2>Exhibition stands in Abu Dhabi</h2><p>Planning a stand at ADNEC? Explore our <a href="/exhibition-stands-abu-dhabi">exhibition stands in Abu Dhabi</a> for design, build and venue planning.</p></section>';
// Homepage sector paths also reach crawlers before JavaScript loads.
routes['/'].body += '<section><h2>Fit-out and renovation in Dubai</h2><p>Explore the service that fits your site, see completed FANN projects and prepare the details we need to scope your brief.</p><ul><li><a href="/fit-out-dubai">Interior fit-out</a>: Commercial interiors, project proof and a fit-out briefing checklist.</li><li><a href="/restaurant-fit-out-dubai">Restaurant fit-out</a>: Restaurant and hospitality interiors with documented Dubai project references.</li><li><a href="/clinic-fit-out-dubai">Clinic fit-out</a>: Healthcare interiors, reception spaces and clinic project references.</li><li><a href="/villa-renovation-dubai">Villa renovation</a>: Residential renovation scope, project references and handover planning.</li></ul></section>';
// Keep buyer-page discovery links in server HTML as well as rendered hubs.
routes['/fit-out-dubai'].body += '<section><h2>Explore fit-out and renovation services</h2><ul><li><a href="/restaurant-fit-out-dubai">Restaurant fit-out in Dubai</a></li><li><a href="/clinic-fit-out-dubai">Clinic fit-out in Dubai</a></li><li><a href="/villa-renovation-dubai">Villa renovation in Dubai</a></li></ul></section>';
routes['/services'].body += '<section><h2>Exhibition services</h2><p><a href="/exhibition-stands-abu-dhabi">Exhibition stands in Abu Dhabi</a></p></section>';
const fitOutReferences = JSON.parse(fs.readFileSync(path.resolve('data/fitOutReferences.json'), 'utf8'));
// Real commercial proof and the buyer briefing checklist also reach no-JavaScript crawlers.
const commercialProof = ['DU-01', 'DU-08', 'DU-09'].map(id => fitOutReferences.find(item => item.id === id));
routes['/fit-out-dubai'].body = routes['/fit-out-dubai'].body.replace(/<h2>Proven on immovable deadlines<\/h2>[\s\S]*?(?=<h2>One team, start to finish<\/h2>)/, `<h2>Completed commercial fit-outs in Dubai</h2><p>Explore documented office, restaurant and healthcare interiors from FANN's project archive.</p>${commercialProof.map(item => `<article><a href="/portfolio/${item.slug}"><img src="${item.images[0]}" alt="${item.name} interior from FANN project archive"><h3>${item.name}</h3></a><p>Dubai, ${item.year} - ${item.area} sq ft</p></article>`).join('')}`);
routes['/fit-out-dubai'].body += '<section><h2>Prepare your fit-out brief</h2><p>Send your site location and use, floor area and current condition; floor plans or BOQ and what must stay; brand, joinery, storage and furniture needs; landlord guidance and access constraints; working budget and target handover date.</p><h3>Agree what the quote covers</h3><p>Distinguish partitions, ceilings, flooring, joinery, MEP coordination and finishes. Confirm inclusions, exclusions, survey dependencies, drawings, approval steps and handover plan. The quote should reflect your site, not a generic price per square foot.</p><a href="/contact">Send your fit-out brief</a><a href="mailto:sales@fann.ae">Email drawings to sales@fann.ae</a></section>';
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
    title: `${item.name} | ${item.emirate} Fit-Out Project | FANN`,
    description: item.description,
    robots: 'index, follow',
    jsonld: JSON.stringify(schema),
    body: `<main><nav><a href="/portfolio">Back to portfolio</a></nav><p>Interior fit-out &amp; renovation · Project reference</p><h1>${text(item.name)}</h1><p>Location: ${text(item.emirate)}, UAE</p><p>Sector: ${text(item.sector)}</p><p>Year: ${text(item.year)}</p><h2>Project overview</h2><p>${text(item.description)}</p>${item.images.map((image, index) => `<img src="${text(image)}" alt="${text(item.name)} - photo ${index + 1}" loading="lazy">`).join('')}${item.area ? `<p>Area: ${text(item.area)} sq ft.</p>` : ''}<a href="/portfolio">Explore more projects</a><a href="/contact">Discuss a fit-out project</a></main>`,
  };
}
// Keep the portfolio's crawler view in sync with real project names and photo covers.
const escapePortfolio = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const portfolioRoute = routes['/portfolio'];
portfolioRoute.title = 'FANN Portfolio | UAE Fit-Out, Exhibitions & Events | FANN';
portfolioRoute.description = 'Explore real FANN projects across Dubai, Abu Dhabi and Ras Al Khaimah, with project photography, sectors, areas and completion years.';
const existingEvents = ['/portfolio/icons-of-porsche-2025-dubai', '/portfolio/special-olympics-uae-unified-champion-schools-2025', '/portfolio/national-expression-adek-abu-dhabi'].map(route => {
  const event = JSON.parse(routes[route].jsonld);
  return {slug: route.replace('/portfolio/', ''), name: event.name, description: event.description, emirate: event.locationCreated.name, sector: 'Events & exhibitions', year: event.dateCreated || '', images: [event.image]};
});
const standProjects = [{"id": 101, "slug": "trevos-light-middle-east", "title": "TREVOS - Light Middle East", "client": "TREVOS", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2023, "image": "/images/stands/1-trevos-light-middle-east.webp", "description": "TREVOS exhibition stand at Light Middle East, Dubai (2023).", "gallery": [{"image": "/images/stands/1-trevos-light-middle-east.webp", "caption": "TREVOS exhibition stand at Light Middle East, Dubai (2023)."}]}, {"id": 102, "slug": "bayara-gulfood", "title": "Bayara - Gulfood", "client": "Bayara", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2020, "image": "/images/stands/2-bayara-gulfood.webp", "description": "Bayara exhibition stand at Gulfood, Dubai (2020).", "gallery": [{"image": "/images/stands/2-bayara-gulfood.webp", "caption": "Bayara exhibition stand at Gulfood, Dubai (2020)."}]}, {"id": 103, "slug": "awazel-big-5", "title": "Awazel - The Big 5", "client": "Awazel", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2012, "image": "/images/stands/3-awazel-big-5.webp", "description": "Awazel exhibition stand at The Big 5, Dubai (2012).", "gallery": [{"image": "/images/stands/3-awazel-big-5.webp", "caption": "Awazel exhibition stand at The Big 5, Dubai (2012)."}]}, {"id": 104, "slug": "saudi-ceramics-big-5", "title": "Saudi Ceramics - The Big 5", "client": "Saudi Ceramics", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2019, "image": "/images/stands/4-saudi-ceramics-big-5.webp", "description": "Saudi Ceramics exhibition stand at The Big 5, Dubai (2019).", "gallery": [{"image": "/images/stands/4-saudi-ceramics-big-5.webp", "caption": "Saudi Ceramics exhibition stand at The Big 5, Dubai (2019)."}]}, {"id": 105, "slug": "apollo-tyres-automechanika", "title": "Apollo Tyres - Automechanika", "client": "Apollo Tyres", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2016, "image": "/images/stands/5-apollo-tyres-automechanika.webp", "description": "Apollo Tyres exhibition stand at Automechanika, Dubai (2016).", "gallery": [{"image": "/images/stands/5-apollo-tyres-automechanika.webp", "caption": "Apollo Tyres exhibition stand at Automechanika, Dubai (2016)."}]}, {"id": 106, "slug": "geven-aircraft-interiors", "title": "Geven - Aircraft Interiors Middle East", "client": "Geven", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "year": 2025, "image": "/images/stands/6-geven-aircraft-interiors.webp", "description": "Geven exhibition stand at Aircraft Interiors Middle East, Dubai (2025).", "gallery": [{"image": "/images/stands/6-geven-aircraft-interiors.webp", "caption": "Geven exhibition stand at Aircraft Interiors Middle East, Dubai (2025)."}]}, {"id": 107, "slug": "dubai-properties-cityscape", "title": "Dubai Properties Group - Cityscape", "client": "Dubai Properties Group", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "image": "/images/stands/7-dubai-properties-cityscape.webp", "description": "Dubai Properties Group exhibition stand at Cityscape, Dubai.", "gallery": [{"image": "/images/stands/7-dubai-properties-cityscape.webp", "caption": "Dubai Properties Group exhibition stand at Cityscape, Dubai."}]}, {"id": 108, "slug": "india-pavilion-gulfood", "title": "India Pavilion - Gulfood", "client": "India Pavilion", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "image": "/images/stands/8-india-pavilion-gulfood.webp", "description": "India Pavilion exhibition stand at Gulfood, Dubai.", "gallery": [{"image": "/images/stands/8-india-pavilion-gulfood.webp", "caption": "India Pavilion exhibition stand at Gulfood, Dubai."}]}, {"id": 109, "slug": "abbott-arab-health", "title": "Abbott - Arab Health", "client": "Abbott", "category": "exhibition", "industry": "Exhibition stands", "location": "Dubai", "image": "/images/stands/9-abbott-arab-health.webp", "description": "Abbott exhibition stand at Arab Health, Dubai.", "gallery": [{"image": "/images/stands/9-abbott-arab-health.webp", "caption": "Abbott exhibition stand at Arab Health, Dubai."}]}];
for (const stand of standProjects) {
  const route = '/portfolio/' + stand.slug;
  routes[route] = {
    title: stand.title + ' | Dubai Exhibition Stand | FANN', description: stand.description, robots: 'index, follow',
    jsonld: JSON.stringify({'@context':'https://schema.org','@type':'CreativeWork',name:stand.title,description:stand.description,image:SITE+stand.image,url:SITE+route,creator:{'@type':'Organization',name:'FANN'},locationCreated:{'@type':'Place',name:stand.location},...(stand.year ? {dateCreated:String(stand.year)} : {})}),
    body: `<main><a href="/portfolio">Back to portfolio</a><h1>${escapePortfolio(stand.title)}</h1><p>${escapePortfolio(stand.description)}</p><img src="${stand.image}" alt="${escapePortfolio(stand.description)}"><a href="/contact">Discuss your exhibition stand</a></main>`,
  };
}
const portfolioItems = [...fitOutReferences, ...existingEvents, ...standProjects.map(p => ({slug:p.slug,name:p.title,description:p.description,emirate:p.location,sector:p.industry,year:p.year || "",images:[p.image]}))];
portfolioRoute.body = `<main><h1>Portfolio</h1><p>Fit-out, exhibitions and events across the UAE. Explore our project photography and details.</p>${portfolioItems.map(item => `<article><a href="/portfolio/${item.slug}"><img src="${escapePortfolio(item.images[0])}" alt="${escapePortfolio(item.name)}" loading="lazy"><h2>${escapePortfolio(item.name)}</h2></a><p>${escapePortfolio(item.emirate)} · ${escapePortfolio(item.sector)}${item.year ? ' · ' + escapePortfolio(item.year) : ''}</p></article>`).join('')}<a href="/contact">Discuss your project</a></main>`;
portfolioRoute.jsonld = JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'FANN Portfolio',url:SITE+'/portfolio',mainEntity:{'@type':'ItemList',numberOfItems:portfolioItems.length,itemListElement:portfolioItems.map((item,index)=>({'@type':'ListItem',position:index+1,url:SITE+'/portfolio/'+item.slug,name:item.name,image:SITE+item.images[0]}))}});
// Keep the staged OpenAI disclosure in the no-JavaScript privacy page too.
if (routes['/privacy-policy']) routes['/privacy-policy'].body += '<section><h2>ChatGPT ads measurement choices</h2><p>After a successful website enquiry, we keep a private submission receipt for up to 30 days plus the next hourly cleanup. It contains submitted contact and enquiry details and is accessible only to our server and authorized account administrators. Your details are not public.</p><p>The ChatGPT measurement setting controls only OpenAI advertising measurement, separately from existing Google and Meta tools. It is off unless you allow it; use the settings button to change your choice. When enabled, it can record ad click references, confirmed enquiries and WhatsApp clicks. A WhatsApp click is not a submitted enquiry. When you allow this measurement and the integration is enabled, automatic advanced matching can detect supported contact information on the page, normalize it and hash it in your browser using SHA-256 to help match conversions to ads. The hashed information can be included with conversion events; raw contact information is not sent through automatic advanced matching. No form contact details are manually passed to OpenAI.</p></section>';
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
