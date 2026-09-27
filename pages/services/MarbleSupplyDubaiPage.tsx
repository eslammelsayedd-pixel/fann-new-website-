import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/marble-supply-dubai';
const pageTitle = 'Marble supply and installation, one team';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Marble Supply Dubai', path },
];

const deliver = [
  'Marble flooring, supplied and installed',
  'Wall cladding and feature walls',
  'Kitchen countertops',
  'Bathroom surfaces and vanity tops',
  'Cut-to-size slabs and tiles for joinery packages',
];

const proof = [
  { img: '/images/projects/icons-of-porsche/06.webp', alt: 'Timber slat entrance at the Icons of Porsche 2025 event build', caption: 'Event build: Icons of Porsche 2025, Dubai Design District', link: '/portfolio/icons-of-porsche-2025-dubai' },
  { img: '/images/projects/national-expression-adek/01.webp', alt: 'Curved gallery walls at the ADEK National Expression exhibition', caption: 'Exhibition build: National Expression for ADEK, Abu Dhabi', link: '/portfolio/national-expression-adek-abu-dhabi' },
  { img: '/images/projects/icons-of-porsche/37.webp', alt: 'Community Village timber entrance at dusk at Icons of Porsche 2025', caption: 'Event build: Community Village entrance, Icons of Porsche 2025', link: '/portfolio/icons-of-porsche-2025-dubai' },
];

const faqs = [
  { question: 'Which areas do you cover?', answer: 'We supply and install marble across Dubai and Abu Dhabi.' },
  { question: 'Do you supply only, or supply and install?', answer: 'Both. You can order material only, or have it supplied and installed by the same team that delivers our fit-out and renovation work.' },
  { question: 'Where is the material held?', answer: 'Material for our projects runs through our own warehouse in Umm Al Quwain, so availability and lead times stay in our hands.' },
  { question: 'Can marble be part of a wider fit-out or renovation?', answer: 'Yes. Marble flooring, cladding, countertops and bathroom surfaces are planned and installed alongside the joinery, MEP and finishes by one accountable team.' },
  { question: 'What do you need from us to quote?', answer: 'Drawings or a BOQ with quantities and finishes, or photos and measurements of the area. We return a clear, itemised scope and quotation without a long tender process.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Marble Supply and Installation',
      name: 'Marble Supplier Dubai',
      description: 'Marble supply and installation across Dubai and Abu Dhabi: flooring, wall cladding, kitchen countertops, bathroom surfaces and cut-to-size slabs and tiles, supplied only or installed by one accountable team.',
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

const MarbleSupplyDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Marble Supplier Dubai | Supply & Installation | FANN"
      description="Marble supply and installation in Dubai and Abu Dhabi with one accountable team. Flooring, wall cladding, countertops and bathroom surfaces, supplied or installed. Itemised quotes."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Material being prepared in the FANN production facility"
      pageTitle={pageTitle}
      pageDescription="One accountable team for material and installation, from first drawing to handover."
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">FANN is a Dubai design and build company. We supply and install marble across Dubai and Abu Dhabi with one accountable team - from first drawing to handover.</p>

      <div className="not-prose my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get an itemised quote</Link>
      </div>

      <h2>What we deliver</h2>
      <ul className="columns-1 md:columns-2">
        {deliver.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p>Material for our projects runs through our own warehouse in Umm Al Quwain, so availability and lead times stay in our hands.</p>

      <h2>Why one team matters for marble</h2>
      <p>Marble is usually where a project slows down - one party supplies, another installs, and nobody owns the result. With FANN the material, the cutting schedule and the installation sit with one accountable team, so the stone arrives when the site is ready and is installed to the same standard as the rest of the interior.</p>

      <h2>Proven on immovable deadlines</h2>
      <p>FANN builds exhibition stands and event environments for opening dates that cannot move - including work for Icons of Porsche and ADEK. A marble package runs on the same clock. We plan backwards from your handover date and deliver to it.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <h2>One team, start to finish</h2>
      <p>Design, material supply, joinery production, site works, MEP coordination and finishing sit with one team. You deal with one accountable partner, not a chain of suppliers and subcontractors. We handle landlord and authority coordination as part of every build.</p>

      <h2>How we quote</h2>
      <p>Per package, itemised, and fast. Send us drawings or a BOQ with quantities and finishes, or photos and measurements of the area, and we return a clear scope and quotation without a long tender process.</p>

      <div className="not-prose my-10 p-8 border border-fann-gold/40 rounded-lg text-center">
        <p className="text-xl text-white font-serif mb-4">Planning marble for a floor, wall, kitchen or bathroom? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <h2>Frequently asked questions</h2>
      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver <Link to="/fit-out-dubai">commercial fit-out</Link>, <Link to="/villa-renovation-dubai">villa renovation</Link> and <Link to="/clinic-fit-out-dubai">clinic fit-out</Link> across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default MarbleSupplyDubaiPage;
