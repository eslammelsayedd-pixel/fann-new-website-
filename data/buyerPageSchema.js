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
