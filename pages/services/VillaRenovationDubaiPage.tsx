import villaScope from '../../villaScopePage.json';
import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/villa-renovation-dubai';
const pageTitle = 'Villa Renovation in Dubai';

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

const faqs = villaScope.faqs;

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
      description="Villa renovation in Dubai and Abu Dhabi. Define rooms, joinery, service interfaces, occupied-site access, approval responsibilities and handover for a project-specific quote."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription={villaScope.intro}
      heroAction={{label: 'Discuss your villa renovation', path: '/contact'}}
      breadcrumbs={breadcrumbs}
    >
      {villaScope.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}
      <h2>Define the quoted work</h2>
      <ul className="columns-1 md:columns-2">{deliver.map(d => <li key={d}>{d}</li>)}</ul>
      <p>Record the included rooms, materials, service interfaces and exclusions in the proposal. Joinery production is reviewed against agreed drawings and the project programme.</p>
      <h2>Related event and exhibition build references</h2>
      <p>These existing portfolio references show event and exhibition work, not completed villa renovations. Keep that project context separate when discussing your residential brief.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <div className="not-prose my-10 p-8 border border-fann-gold/40 rounded-lg text-center">
        <p className="text-xl text-white font-serif mb-4">Renovating a villa, or upgrading a kitchen or wardrobe? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold !text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver <Link to="/fit-out-dubai">commercial fit-out</Link>, <Link to="/restaurant-fit-out-dubai">restaurant fit-out</Link> and <Link to="/clinic-fit-out-dubai">clinic fit-out</Link> across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default VillaRenovationDubaiPage;
