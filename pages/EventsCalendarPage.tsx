import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import calendar from '../data/exhibitionCalendar.json';

const formatDate = (date: string) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
const EventsCalendarPage: React.FC = () => {
  const location = useLocation();
  const guide = calendar.guides.find(item => item.path === location.pathname);
  const [country, setCountry] = useState('All');
  const [industry, setIndustry] = useState('All');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const upcoming = useMemo(() => calendar.events.filter(event => event.endDate >= today), [today]);
  const visible = upcoming.filter(event => (country === 'All' || event.country === country) && (industry === 'All' || event.industry === industry));
  const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'UAE & Saudi Arabia exhibitions calendar 2026-2027', url: 'https://fann.ae/events-calendar', dateModified: calendar.checkedOn, mainEntity: { '@type': 'ItemList', numberOfItems: upcoming.length, itemListElement: upcoming.map((event, index) => ({ '@type': 'ListItem', position: index + 1, name: event.name, url: event.source })) } };
  if (guide) return <main className="bg-fann-charcoal min-h-screen text-white pt-32 pb-48 md:pb-24">
    <SEO title={`${guide.name} Exhibition Stand Planning | FANN`} description={guide.intro} schema={{'@context':'https://schema.org','@type':'Article',headline:`${guide.name} exhibition stand planning`,dateModified:calendar.checkedOn,author:{'@type':'Organization',name:'FANN'},mainEntityOfPage:`https://fann.ae${guide.path}`}} />
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <Link to="/events-calendar" className="inline-flex min-h-[48px] items-center text-fann-gold underline mb-6">Back to exhibitions calendar</Link>
      <p className="text-fann-gold font-bold mb-4">Dates checked {formatDate(calendar.checkedOn)} | {guide.date}</p>
      <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{guide.name} exhibition stand planning</h1>
      <p className="text-lg text-gray-300 mb-4">{guide.venue}</p><p className="text-lg text-gray-300 leading-relaxed mb-8">{guide.intro}</p>
      <Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center justify-center bg-fann-gold text-black font-bold px-6 py-3 mb-10">Share your show brief</Link>
      {guide.sections.map(section => <section key={section.heading} className="mb-10"><h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{section.heading}</h2><p className="text-gray-300 leading-relaxed">{section.text}</p></section>)}
      <section className="border-y border-white/15 py-8 mb-10"><h2 className="text-2xl font-serif font-bold mb-4">What to send for a scoped quote</h2><p className="text-gray-300 leading-relaxed">Send the show, hall and stand allocation, dimensions, open sides, floor plan, products and demonstrations, utilities, brand assets, meeting/storage needs and your actual submission and installation deadlines. Agree design, materials, graphics, venue submissions, fabrication, transport, installation and any dismantling as separate scope items.</p><p className="text-gray-400 leading-relaxed mt-4">FANN is an independent stand design-and-build company, not the show organiser or an appointed official contractor. This guide does not replace your current exhibitor manual. No stand size, price, permit, deadline or utility capacity is inferred from the show dates.</p></section>
      {!!guide.proof.length && <section className="mb-10"><h2 className="text-2xl font-serif font-bold mb-4">Documented stand reference</h2>{guide.proof.map(proof => <Link key={proof.path} to={proof.path} className="block min-h-[48px] text-fann-gold underline leading-relaxed">{proof.label}</Link>)}</section>}
      <section className="mb-10"><h2 className="text-2xl font-serif font-bold mb-4">Official planning sources</h2>{guide.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="block min-h-[48px] text-fann-gold underline leading-relaxed">{source.label} (opens a new tab)</a>)}</section>
      <div className="flex flex-wrap gap-5"><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center bg-fann-gold text-black font-bold px-6 py-3">Get a scoped stand quote</Link><Link to={guide.name === 'ADIPEC 2026' ? '/exhibition-stands-abu-dhabi' : '/services/custom-exhibition-stands-dubai'} className="inline-flex min-h-[48px] items-center text-fann-gold underline">Explore stand design and build</Link></div>
    </article>
  </main>;
  return <main className="bg-fann-charcoal min-h-screen text-white pt-32 pb-48 md:pb-24">
    <SEO title="UAE & Saudi Exhibitions Calendar 2026-2027 | Dates & Venues" description="Selected upcoming trade shows in Dubai, Abu Dhabi, Riyadh and Jeddah, with organiser date sources and an exhibition stand planning checklist." schema={schema} />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      <p className="text-fann-gold text-sm font-bold mb-4">Exhibitor planning | Dates checked {formatDate(calendar.checkedOn)}</p>
      <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">UAE & Saudi Arabia exhibitions calendar</h1>
      <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-5">Planning an exhibition stand in Dubai, Abu Dhabi, Riyadh or Jeddah? Use this selected 2026-2027 trade-show calendar to match your show, venue and opening date to your stand brief.</p>
      <p className="text-gray-400 leading-relaxed max-w-3xl mb-8">Dates and venues below were checked against organiser or venue pages. This is not a complete regional calendar. Dates can change: confirm with the organiser before booking travel, exhibition space or production. FANN is not the organiser of these shows.</p>
      <Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center justify-center bg-fann-gold text-black font-bold px-6 py-3 mb-12">Share your show brief</Link>
      <section aria-labelledby="calendar-heading">
        <h2 id="calendar-heading" className="text-3xl font-serif font-bold mb-6">Upcoming exhibitions and trade shows</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-7">
          <label className="text-gray-300">Country<select aria-label="Country" value={country} onChange={e => setCountry(e.target.value)} className="block w-full bg-fann-charcoal-light text-white border border-white/20 px-4 py-3 mt-2 min-h-[48px]"><option>All</option><option>UAE</option><option>Saudi Arabia</option></select></label>
          <label className="text-gray-300">Industry<select aria-label="Industry" value={industry} onChange={e => setIndustry(e.target.value)} className="block w-full bg-fann-charcoal-light text-white border border-white/20 px-4 py-3 mt-2 min-h-[48px]"><option>All</option>{[...new Set(upcoming.map(event => event.industry))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
        </div>
        <p className="text-gray-400 mb-5" aria-live="polite">{visible.length} selected shows</p>
        <div className="grid md:grid-cols-2 gap-6">{visible.map(event => <article key={event.name} className="border border-white/15 bg-fann-charcoal-light p-6 rounded-lg">
          <p className="text-fann-gold font-bold mb-3"><time dateTime={event.startDate}>{formatDate(event.startDate)}</time> - <time dateTime={event.endDate}>{formatDate(event.endDate)}</time></p>
          <h3 className="text-2xl font-bold mb-3">{event.name}</h3>
          <p className="text-gray-300 leading-relaxed">{event.venue}</p><p className="text-gray-400 mt-2 mb-5">{event.country} | {event.industry}</p>
          {calendar.guides.filter(guide => guide.name === event.name + ' 2026').map(guide => <Link key={guide.path} to={guide.path} className="block min-h-[48px] text-fann-gold underline font-bold mb-2">Exhibitor stand planning guide</Link>)}
          <a href={event.source} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center text-fann-gold underline underline-offset-4">Official dates and venue <span className="sr-only">for {event.name} (opens a new tab)</span></a>
        </article>)}</div>
        {!visible.length && <p className="text-gray-300 border border-white/15 p-6">No verified upcoming shows match these filters. Choose another country or industry.</p>}
      </section>
      <section className="mt-16 border-t border-white/15 pt-10 max-w-4xl" aria-labelledby="brief-heading">
        <h2 id="brief-heading" className="text-3xl font-serif font-bold mb-6">Turn a show date into a stand brief</h2>
        <ol className="list-decimal pl-6 space-y-4 text-gray-300 leading-relaxed"><li>Confirm the show, exact venue and your allocated stand dimensions and open sides.</li><li>Get the current exhibitor manual and submission deadlines. Show opening dates are not design, approval or move-in deadlines.</li><li>List products, display sizes, power needs, storage, reception and meeting areas. Add your floor plan if available.</li><li>Agree what the quote includes: design, materials, graphics, venue submissions, installation and any dismantling. Do not assume venue services or overhead rigging are included.</li></ol>
        <p className="text-gray-400 leading-relaxed mt-6">For multi-venue shows, check the hall and venue on your allocation. The GITEX card lists the exhibition days, 8-11 December; its separate summit day is not a stand-installation deadline.</p>
        <div className="flex flex-wrap gap-5 mt-8"><Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center bg-fann-gold text-black font-bold px-6 py-3">Get a scoped stand quote</Link><Link to="/services/custom-exhibition-stands-dubai" className="inline-flex min-h-[48px] items-center text-fann-gold underline">Dubai stand design and build</Link><Link to="/exhibition-stands-abu-dhabi" className="inline-flex min-h-[48px] items-center text-fann-gold underline">Abu Dhabi exhibition stands</Link></div>
      </section>
    </div>
  </main>;
};
export default EventsCalendarPage;
