// Venue lists use the same Dubai calendar-day cutoff for React and crawler HTML.
export function upcomingVenueEvents(events, today = new Intl.DateTimeFormat('en-CA', {
 timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date())) {
 const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
 return events.filter(event => {
  const match = /^(?:\d{1,2}-)?(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(event.dates || '');
  if (!match) return true; // An unknown format is not evidence that an event ended.
  const month = months.indexOf(match[2]);
  if (month < 0) return true;
  const end = `${match[3]}-${String(month + 1).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  return end >= today; // Keep the event throughout its final day.
 });
}
export function buyerPageSchema(path, page) {
 // Reuse documented 2025 archive stands on the buyer pages, not only portfolio.
 const recentProof = {
 "/exhibition-stand-builders-dubai": [
  {
   "path": "/portfolio/trevos-light-middle-east",
   "image": "/images/stands/1-trevos-light-middle-east.webp",
   "name": "TREVOS - Light Middle East",
   "location": "Dubai, 2023",
   "text": "Completed stand with an overhead identity feature, product displays and visitor-facing space. Use it to discuss the relationship between brand visibility and floor layout."
  },
  {
   "path": "/portfolio/geven-aircraft-interiors",
   "image": "/images/stands/6-geven-aircraft-interiors.webp",
   "name": "Geven - Aircraft Interiors Middle East",
   "location": "Dubai, 2025",
   "text": "Completed aircraft-interiors exhibition stand reference. Share your own product dimensions and access needs rather than copying another exhibitor’s layout."
  },
  {
   "path": "/portfolio/bayara-gulfood",
   "image": "/images/stands/2-bayara-gulfood.webp",
   "name": "Bayara - Gulfood",
   "location": "Dubai, 2020",
   "text": "The photograph shows Bayara identity, labelled product-category shelving and front-facing counters. Some fixtures and products are covered, so this is not evidence of a visitor-ready display or food-handling activity."
  },
  {
   "path": "/portfolio/mutaba-food-industries-gulfood-2025",
   "image": "/images/stands/10-mutaba-food-industries-gulfood-2025.webp",
   "name": "Mutaba Food Industries Group - Gulfood 2025",
   "location": "Dubai World Trade Centre, 2025",
   "text": "A curved overhead brand feature, a large screen facing the aisle and a reception counter are visible in this completed stand photograph. Use it to brief the balance between brand display and a visitor approach, not to infer screen specifications or structural details."
  }
 ],
 "/gulfood-exhibition-stand-design-dubai": [
  {
   "path": "/portfolio/mutaba-food-industries-gulfood-2025",
   "image": "/images/stands/10-mutaba-food-industries-gulfood-2025.webp",
   "name": "Mutaba Food Industries Group - Gulfood 2025",
   "location": "Dubai World Trade Centre, 2025",
   "text": "A curved overhead brand feature, a large screen facing the aisle and a reception counter are visible in this completed stand photograph. Use it to brief the balance between brand display and a visitor approach, not to infer screen specifications or structural details."
  },
  {
   "path": "/portfolio/leiva-gulfood-2025",
   "image": "/images/stands/11-leiva-gulfood-2025.webp",
   "name": "Leiva - Gulfood 2025",
   "location": "Dubai World Trade Centre, 2025",
   "text": "The photograph shows a branded fascia, wall-mounted product information, seating and a freestanding product display at the aisle. Share your own packaging, display quantities and meeting needs to brief a stand around your products."
  },
  {
   "path": "/portfolio/russia-pavilion-gulfood-2025",
   "image": "/images/stands/12-russia-pavilion-gulfood-2025.webp",
   "name": "Russia Pavilion - Gulfood 2025",
   "location": "Dubai World Trade Centre, 2025",
   "text": "A shared pavilion identity sits above separate branded product-display areas. Use this archive reference to discuss how several exhibitors can be identified within one pavilion; it does not establish a current country appointment or organiser approval."
  },
  {
   "path": "/portfolio/bayara-gulfood",
   "image": "/images/stands/2-bayara-gulfood.webp",
   "name": "Bayara - Gulfood",
   "location": "Dubai, 2020",
   "text": "The photograph shows Bayara identity, labelled product-category shelving and several front-facing counters. Some fixtures and products are covered, so this is not evidence of a completed visitor-ready display, tasting activity or operating kitchen."
  },
  {
   "path": "/portfolio/india-pavilion-gulfood",
   "image": "/images/stands/8-india-pavilion-gulfood.webp",
   "name": "India Pavilion - Gulfood",
   "location": "Dubai, year not stated",
   "text": "The photograph shows a tall India-branded frame, food graphics, counters and seating areas. It is a reference for shared identity and individual product discussions, not proof of pavilion capacity, structural approval, utility provision or visitor results."
  }
 ]
};
 if (recentProof[path]) page.proof = recentProof[path];
 if (path === '/gulfood-exhibition-stand-design-dubai') {
  page.proofHeading = "Gulfood 2025 stands and earlier food-show references";
  page.proofNote = "Completed stands from the FANN project archive include Mutaba Food Industries Group, Leiva and Russia Pavilion at Gulfood 2025, alongside earlier references below. The photographs show layouts and visible features, not material specifications, structural capacity, measured visitor results or a current organiser appointment.";
 }

 if (page.eventsList) page.eventsList = upcomingVenueEvents(page.eventsList);
 // Repair stale related destinations without creating duplicate show pages.
 const relatedRepairs = {
  '/arabplast-exhibition-stand-design-dubai': {'/automechanika-dubai-exhibition-stand-design': {path: '/automechanika-dubai-exhibition-stand-design-dubai', label: 'Automechanika Dubai stand design'}},
  '/cabsat-exhibition-stand-design-dubai': {'/integrate-middle-east-exhibition-stand-design': {path: '/dec-expo-city-exhibition-stand-design-dubai', label: 'DEC and Expo City stand planning'}}
 }[path];
 if (relatedRepairs) page.related = page.related.map(link => relatedRepairs[link.path] || link);
 // Specific show briefs should lead directly to their current venue-planning guide.
 // This adapter runs before both React rendering and crawler prerendering.
 const venueGuide = {
  '/adipec-exhibition-stand-design-abu-dhabi': {path: '/adnec-exhibition-stand-design-abu-dhabi', label: 'ADNEC stand planning in Abu Dhabi'},
  '/automechanika-dubai-exhibition-stand-design-dubai': {path: '/dec-expo-city-exhibition-stand-design-dubai', label: 'DEC and Expo City stand planning'},
  '/intersec-exhibition-stand-design-dubai': {path: '/dwtc-exhibition-stand-design-dubai', label: 'DWTC stand planning in Dubai'}
 }[path];
 if (venueGuide && !page.related.some(link => link.path === venueGuide.path)) {
  page.related = [venueGuide, ...page.related];
 }
 // Keep rendered copy and FAQ schema aligned with the quote form's required fields.
 // Limit this correction to UAE pages; Saudi pages are outside this content pass.
 if (!/riyadh|jeddah/.test(path)) {
  const correct = text => typeof text === 'string' ? text
   .replaceAll('your name and one contact method', 'your name, phone number and work email')
   .replaceAll('your name and phone or email', 'your name, phone number and work email')
   .replaceAll('your name, company, one contact method', 'your name, company, phone number and work email') : text;
  page.proposalText = correct(page.proposalText);
  page.faqs = page.faqs.map(f => ({...f, answer: correct(f.answer)}));
 }
 const url='https://fann.ae'+path;
 return {'@context':'https://schema.org','@graph':[
 {'@type':'Service',name:page.heading,serviceType:page.serviceType || (path === '/fit-out-company-dubai' ? 'Office and commercial interior fit-out' : 'Exhibition stand design and build'),description:page.description,url,provider:{'@type':'Organization',name:'FANN',url:'https://fann.ae'},areaServed:{'@type':'City',name:page.city || 'Abu Dhabi'}},
 {'@type':'BreadcrumbList',itemListElement:[{name:'Home',url:'https://fann.ae/'},{name:'Services',url:'https://fann.ae/services'},{name:page.heading,url}].map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:x.url}))},
 {'@type':'FAQPage',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
 ]};
}
