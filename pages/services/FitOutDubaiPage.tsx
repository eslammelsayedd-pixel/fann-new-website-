import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/fit-out-dubai';
const pageTitle = 'Commercial fit-out, built in-house';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Commercial Fit-Out Dubai', path },
];

const deliver = [
  'Partitioning',
  'Ceilings',
  'Flooring',
  'Custom joinery and panelling',
  'MEP coordination',
  'Final finishes',
];

const proof = [
  { img: '/images/projects/icons-of-porsche/06.webp', alt: 'Timber slat entrance at the Icons of Porsche 2025 event build', caption: 'Event build: Icons of Porsche 2025, Dubai Design District', link: '/portfolio/icons-of-porsche-2025-dubai' },
  { img: '/images/projects/national-expression-adek/01.webp', alt: 'Curved gallery walls at the ADEK National Expression exhibition', caption: 'Exhibition build: National Expression for ADEK, Abu Dhabi', link: '/portfolio/national-expression-adek-abu-dhabi' },
  { img: '/images/projects/icons-of-porsche/37.webp', alt: 'Community Village timber entrance at dusk at Icons of Porsche 2025', caption: 'Event build: Community Village entrance, Icons of Porsche 2025', link: '/portfolio/icons-of-porsche-2025-dubai' },
];

const concepts = [
  { img: '/images/concepts/clinic.webp', title: 'Clinic reception', text: 'Curved reception desk with fluted oak front, terrazzo floor, calm sage palette and a waiting lounge planned around patient flow.' },
  { img: '/images/concepts/cafe.webp', title: 'Specialty coffee and restaurant', text: 'Ribbed walnut bar with stone top, open display shelving, banquette seating and warm pendant lighting.' },
  { img: '/images/concepts/retail.webp', title: 'Boutique retail', text: 'Travertine display table, backlit oak niches, brass rails and a curved fitting room in a warm neutral palette.' },
];

const faqs = [
  { question: 'Which areas do you cover?', answer: 'We deliver commercial fit-outs across Dubai and Abu Dhabi.' },
  { question: 'What do you need from us to quote?', answer: 'Drawings or a BOQ, the site location and your target opening date. We return a clear, itemised scope and quotation per site, without a long tender process.' },
  { question: 'Do you make the joinery yourselves?', answer: 'Yes. Every joinery piece is produced in our own workshop in Umm Al Quwain, so quality and lead times stay in our hands.' },
  { question: 'Can you handle more than one site?', answer: 'Yes. One team and one specification across every site, with an itemised quote for each location.' },
  { question: 'Who handles landlord and authority coordination?', answer: 'We do. Venue and authority coordination is part of every build.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Commercial Fit-Out',
      name: 'Commercial Fit-Out Contractor Dubai',
      description: 'Commercial fit-out across Dubai and Abu Dhabi: partitioning, ceilings, flooring, custom joinery, MEP coordination and finishes, with an in-house joinery workshop.',
      provider: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae', telephone: '+971505667502', email: 'sales@fann.ae' },
      areaServed: [{ '@type': 'City', name: 'Dubai' }, { '@type': 'City', name: 'Abu Dhabi' }],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `https://fann.ae${c.path}` })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
  ],
};

const FitOutDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Commercial Fit-Out Contractor Dubai | FANN"
      description="Commercial fit-out in Dubai and Abu Dhabi with one accountable team and our own joinery workshop. Partitions, ceilings, flooring, joinery, MEP coordination, finishes. Itemised quotes per site."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription="One accountable team and our own joinery workshop, from first drawing to final finish."
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">FANN is a Dubai design and build company. We deliver commercial fit-outs across Dubai and Abu Dhabi with one accountable team and our own joinery workshop - from first drawing to final finish.</p>

      <div className="not-prose my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get an itemised quote</Link>
      </div>

      <h2>What we deliver</h2>
      <ul className="columns-1 md:columns-2">
        {deliver.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p>Every joinery piece is produced in our own workshop, so quality and lead times stay in our hands.</p>

      <h2>Why in-house matters</h2>
      <p>Our production facility means no third-party joinery lead times, one consistent specification across every site, and changes turned around in days, not weeks. For operators opening more than one location, that is how every site opens to the same standard.</p>

      <h2>Proven on immovable deadlines</h2>
      <p>FANN builds exhibition stands and event environments for opening dates that cannot move - including work for Icons of Porsche and ADEK. A store or restaurant opening runs on the same clock. We plan backwards from your opening date and deliver to it.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <h2>One team, start to finish</h2>
      <p>Design, joinery production, site works, MEP coordination and finishing sit with one team. You deal with one accountable partner, not a chain of subcontractors. We handle venue and authority coordination as part of every build.</p>

      <h2>How we quote</h2>
      <p>Per site, itemised, and fast. Send us drawings or a BOQ and we return a clear scope and quotation without a long tender process.</p>

      <h2 id="design-concepts">Design concepts</h2>
      <p>These are design concepts created by FANN to show how we approach clinic, restaurant and retail interiors. They are concept visuals, not photos of completed projects. We design every fit-out around your brand, site and budget, and we can prepare a concept like this for your space before you commit.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {concepts.map(c => (
          <figure key={c.img} className="bg-fann-charcoal-light border border-fann-gold/40 rounded-lg overflow-hidden">
            <div className="relative">
              <img src={c.img} alt={`Design concept by FANN: ${c.title.toLowerCase()} interior (concept visual, not a completed project)`} loading="lazy" className="w-full aspect-video object-cover" />
              <span className="absolute top-3 left-3 bg-fann-gold text-fann-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">Design Concept</span>
            </div>
            <figcaption className="p-5">
              <p className="text-xs uppercase tracking-wider text-fann-gold mb-1">Design Concept - designed by FANN</p>
              <h3 className="text-lg font-serif text-white mb-2">{c.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{c.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="not-prose my-10 p-8 border border-fann-gold/40 rounded-lg text-center">
        <p className="text-xl text-white font-serif mb-4">Opening a new site or refreshing an existing one? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <h2>Frequently asked questions</h2>
      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver office, clinic and school fit-out and renovation projects across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default FitOutDubaiPage;
