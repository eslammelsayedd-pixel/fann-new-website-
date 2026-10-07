import buyerFaqs from '../../data/buyerScopeFaqs.json';
import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/fit-out-dubai';

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
  {
    "img": "/images/projects/182-fitout-a1a8a8232334eb205ddcd9c1aeff8301078aab74.webp",
    "alt": "AB Prime Realty Office interior from FANN project archive",
    "caption": "AB Prime Realty Office - Dubai, 2025 - 10,118 sq ft",
    "link": "/portfolio/fit-out/42-ab-prime-realty-office"
  },
  {
    "img": "/images/projects/186-fitout-a321ed2036ac59ab5156d5f635b75a44b9dbd8b3.webp",
    "alt": "Adaline Restaurant interior from FANN project archive",
    "caption": "Adaline Restaurant - Dubai, 2024 - 6,000 sq ft",
    "link": "/portfolio/fit-out/24-adaline-restaurant"
  },
  {
    "img": "/images/projects/109-fitout-572a19833891731b140968ccbb6bd3b78b4570f9.webp",
    "alt": "Aspris Clinic - City Walk interior from FANN project archive",
    "caption": "Aspris Clinic - City Walk - Dubai, 2024 - 5,490 sq ft",
    "link": "/portfolio/fit-out/30-aspris-clinic-city-walk"
  }
];

const concepts = [
  { img: '/images/concepts/clinic.webp', title: 'Clinic reception', text: 'Curved reception desk with fluted oak front, terrazzo floor, calm sage palette and a waiting lounge planned around patient flow.' },
  { img: '/images/concepts/cafe.webp', title: 'Specialty coffee and restaurant', text: 'Ribbed walnut bar with stone top, open display shelving, banquette seating and warm pendant lighting.' },
  { img: '/images/concepts/retail.webp', title: 'Boutique retail', text: 'Travertine display table, backlit oak niches, brass rails and a curved fitting room in a warm neutral palette.' },
];

const faqs = buyerFaqs['/fit-out-dubai'];

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
      title="Interior Fit-Out Dubai | Commercial Contractor | FANN"
      description="Commercial fit-out in Dubai and Abu Dhabi with one accountable team and our own joinery workshop. Partitions, ceilings, flooring, joinery, MEP coordination, finishes. Itemised quotes per site."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle="Interior Fit-Out in Dubai, Built In-House"
      pageDescription="One accountable team and our own joinery workshop, from first drawing to final finish."
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">FANN is a Dubai design and build company. We deliver commercial fit-outs across Dubai and Abu Dhabi with one accountable team and our own joinery workshop - from first drawing to final finish.</p>

      <div className="not-prose my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get an itemised quote</Link>
      </div>

      <h2>What we deliver</h2>
      <ul className="columns-1 md:columns-2">
        {deliver.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p>Every joinery piece is produced in our own workshop, so quality and lead times stay in our hands.</p>

      <h2>Why in-house matters</h2>
      <p>Our production facility means no third-party joinery lead times, one consistent specification across every site, and changes turned around in days, not weeks. For operators opening more than one location, that is how every site opens to the same standard.</p>

      <h2>Completed commercial fit-outs in Dubai</h2>
      <p>Explore documented office, restaurant and healthcare interiors from FANN's project archive. Each project links to its own photographs and details, so you can review work relevant to your space rather than rely on concept images.</p>
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

      <h2>Prepare your fit-out brief</h2>
      <p>A useful brief lets us separate the work your site needs from assumptions. Send what you have; tell us which drawings or site details are still missing.</p>
      <ul>
        <li><strong>Site and use:</strong> Location, floor area, whether the space is an office, restaurant, clinic or another commercial use, and its current condition.</li>
        <li><strong>Drawings and scope:</strong> Floor plans or a BOQ, the areas being changed, and any existing finishes or equipment that must stay.</li>
        <li><strong>Design and joinery:</strong> Brand guidelines, reference images, reception or counter needs, storage and furniture requirements.</li>
        <li><strong>Building constraints:</strong> Landlord fit-out guidance, access hours and any known submission or site restrictions. Approval needs are checked for your specific site.</li>
        <li><strong>Budget and opening date:</strong> Your working budget, target handover date and whether the site will remain occupied during works.</li>
      </ul>
      <h3>Agree what the quote covers</h3>
      <p>Ask for the scope to distinguish partitions, ceilings, flooring, joinery, MEP coordination and finishes. Confirm what is included, excluded or dependent on a site survey, along with the drawings, approval steps and handover plan. The quote should reflect your actual site, not a generic price per square foot.</p>
      <p><Link to="/contact">Send your fit-out brief</Link>, or email drawings to <a href="mailto:sales@fann.ae">sales@fann.ae</a>. For specialist spaces, review our <Link to="/restaurant-fit-out-dubai">restaurant</Link> and <Link to="/clinic-fit-out-dubai">clinic fit-out</Link> pages.</p>

      <h2 id="design-concepts">Design concepts</h2>
      <p>These are design concepts created by FANN to show how we approach clinic, restaurant and retail interiors. They are concept visuals, not photos of completed projects. We design every fit-out around your brand, site and budget, and we can prepare a concept like this for your space before you commit.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {concepts.map(c => (
          <figure key={c.img} className="bg-fann-charcoal-light border border-fann-gold/40 rounded-lg overflow-hidden">
            <div className="relative">
              <img src={c.img} alt={`Design concept by FANN: ${c.title.toLowerCase()} interior (concept visual, not a completed project)`} loading="lazy" className="w-full aspect-video object-cover" />
              <span className="absolute top-3 left-3 bg-fann-gold text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">Design Concept</span>
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
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <h2>Explore fit-out and renovation services</h2>
      <p>Find the service that fits your space:</p>
      <ul>
        <li><Link to="/restaurant-fit-out-dubai">Restaurant fit-out in Dubai</Link></li>
        <li><Link to="/clinic-fit-out-dubai">Clinic fit-out in Dubai</Link></li>
        <li><Link to="/villa-renovation-dubai">Villa renovation in Dubai</Link></li>
      </ul>

      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver office, clinic and school fit-out and renovation projects across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default FitOutDubaiPage;
