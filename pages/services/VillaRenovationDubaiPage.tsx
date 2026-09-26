import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/villa-renovation-dubai';
const pageTitle = 'Villa renovation, built in-house';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Villa Renovation Dubai', path },
];

const deliver = [
  'Kitchen and pantry joinery',
  'Wardrobes, walk-in closets and storage',
  'Bathroom refurbishment',
  'Flooring',
  'Lighting and MEP coordination',
  'Final finishes',
];

const proof = [
  { img: '/images/projects/icons-of-porsche/06.webp', alt: 'Timber slat entrance at the Icons of Porsche 2025 event build', caption: 'Event build: Icons of Porsche 2025, Dubai Design District', link: '/portfolio/icons-of-porsche-2025-dubai' },
  { img: '/images/projects/national-expression-adek/01.webp', alt: 'Curved gallery walls at the ADEK National Expression exhibition', caption: 'Exhibition build: National Expression for ADEK, Abu Dhabi', link: '/portfolio/national-expression-adek-abu-dhabi' },
  { img: '/images/projects/icons-of-porsche/37.webp', alt: 'Community Village timber entrance at dusk at Icons of Porsche 2025', caption: 'Event build: Community Village entrance, Icons of Porsche 2025', link: '/portfolio/icons-of-porsche-2025-dubai' },
];

const faqs = [
  { question: 'Which areas do you cover?', answer: 'We renovate villas across Dubai and Abu Dhabi.' },
  { question: 'Do you build the kitchens and wardrobes yourselves?', answer: 'Yes. Kitchens, wardrobes, walk-in closets, storage and wall panelling are produced in our own joinery workshop in Umm Al Quwain, so quality and lead times stay in our hands.' },
  { question: 'Who handles community and authority coordination?', answer: 'We do. Community, developer and authority coordination is part of every build, whether the villa sits in a managed community or on a standalone plot.' },
  { question: 'Do you coordinate MEP?', answer: 'Yes. MEP coordination sits with our team as part of the renovation, so services and finishes are planned together.' },
  { question: 'What do you need from us to quote?', answer: 'Drawings or photos of the current space, the community and your target handover date. We return a clear, itemised scope and quotation without a long tender process.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Villa Renovation',
      name: 'Villa Renovation Contractor Dubai',
      description: 'Villa renovation across Dubai and Abu Dhabi: kitchens, wardrobes and walk-in closets, bathroom refurbishment, flooring, MEP coordination and finishes, with an in-house joinery workshop.',
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

const VillaRenovationDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Villa Renovation Contractor Dubai | FANN"
      description="Villa renovation in Dubai and Abu Dhabi with one accountable team and our own joinery workshop. Kitchens, wardrobes, bathrooms, flooring, MEP coordination, finishes. Itemised quotes."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription="One accountable team and our own joinery workshop, from first drawing to handover."
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">FANN is a Dubai design and build company. We renovate villas across Dubai and Abu Dhabi with one accountable team and our own joinery workshop - from first drawing to handover.</p>

      <div className="not-prose my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get an itemised quote</Link>
      </div>

      <h2>What we deliver</h2>
      <ul className="columns-1 md:columns-2">
        {deliver.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p>Every kitchen, wardrobe and panelling run is produced in our own workshop, so quality and lead times stay in our hands.</p>

      <h2>Why in-house matters for villa renovations</h2>
      <p>A renovated villa is judged on the details you touch every day - the kitchen, the wardrobes, the panelling. Our production facility means they are built to one specification, with no third-party joinery lead times and changes turned around in days, not weeks. That is how a renovation stays on programme and on one standard.</p>

      <h2>Proven on immovable deadlines</h2>
      <p>FANN builds exhibition stands and event environments for opening dates that cannot move - including work for Icons of Porsche and ADEK. A renovation handover runs on the same clock. We plan backwards from your handover date and deliver to it.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <h2>One team, start to finish</h2>
      <p>Design, joinery production, site works, MEP coordination and finishing sit with one team. You deal with one accountable partner, not a chain of subcontractors. We handle community, developer and authority coordination as part of every build.</p>

      <h2>How we quote</h2>
      <p>Per villa, itemised, and fast. Send us drawings or photos of the current space and we return a clear scope and quotation without a long tender process.</p>

      <div className="not-prose my-10 p-8 border border-fann-gold/40 rounded-lg text-center">
        <p className="text-xl text-white font-serif mb-4">Renovating a villa, or upgrading a kitchen or wardrobe? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <h2>Frequently asked questions</h2>
      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver <Link to="/fit-out-dubai">commercial fit-out</Link>, <Link to="/restaurant-fit-out-dubai">restaurant fit-out</Link> and <Link to="/clinic-fit-out-dubai">clinic fit-out</Link> across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default VillaRenovationDubaiPage;
