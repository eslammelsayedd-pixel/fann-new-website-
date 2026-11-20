import restaurantScope from '../../restaurantScopePage.json';
import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/restaurant-fit-out-dubai';
const pageTitle = 'Restaurant Fit-Out in Dubai';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Restaurant Fit-Out Dubai', path },
];

const deliver = [
  'Banquette seating and booths',
  'Bar counters and back bars',
  'Display shelving and wall panelling',
  'Ceilings and flooring',
  'Lighting and MEP coordination',
  'Final finishes',
];

const proof = [
  { img: '/images/projects/icons-of-porsche/06.webp', alt: 'Timber slat entrance at the Icons of Porsche 2025 event build', caption: 'Event build: Icons of Porsche 2025, Dubai Design District', link: '/portfolio/icons-of-porsche-2025-dubai' },
  { img: '/images/projects/national-expression-adek/01.webp', alt: 'Curved gallery walls at the ADEK National Expression exhibition', caption: 'Exhibition build: National Expression for ADEK, Abu Dhabi', link: '/portfolio/national-expression-adek-abu-dhabi' },
  { img: '/images/projects/icons-of-porsche/37.webp', alt: 'Community Village timber entrance at dusk at Icons of Porsche 2025', caption: 'Event build: Community Village entrance, Icons of Porsche 2025', link: '/portfolio/icons-of-porsche-2025-dubai' },
];

const concepts = [
  { img: '/images/concepts/cafe.webp', title: 'Specialty coffee and restaurant', text: 'Ribbed walnut bar with stone top, open display shelving, banquette seating and warm pendant lighting.' },
];

const faqs = restaurantScope.faqs;

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Restaurant Fit-Out',
      name: 'Restaurant Fit-Out Contractor Dubai',
      description: 'Restaurant and cafe fit-out across Dubai and Abu Dhabi: banquette seating, bar counters, custom joinery, ceilings, flooring, MEP coordination and finishes, with an in-house joinery workshop.',
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

const RestaurantFitOutDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Restaurant Fit-Out Contractor Dubai | FANN"
      description="Restaurant and cafe fit-out in Dubai and Abu Dhabi. Define joinery, kitchen interfaces, approval responsibilities, site access and handover before a project-specific quote."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription={restaurantScope.intro}
      heroAction={{label: 'Discuss your restaurant scope', path: '/contact'}}
      breadcrumbs={breadcrumbs}
    >
      {restaurantScope.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}
      <h2>Define the quoted work</h2>
      <ul>{deliver.map(d => <li key={d}>{d}</li>)}</ul>
      <p>Record included areas, materials, equipment interfaces and exclusions in the proposal. Site services and specialist requirements need confirmation for the actual unit.</p>
      <h2>Related event and exhibition build references</h2>
      <p>These existing portfolio references show event and exhibition work, not completed restaurant interiors. Keep their project context separate when preparing your restaurant brief.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <h2 id="design-concepts">Design concept</h2>
      <p>This is a design concept created by FANN to show how we approach restaurant and cafe interiors. It is a concept visual, not a photo of a completed project. We design every fit-out around your brand, site and budget, and we can prepare a concept like this for your space before you commit.</p>
      <div className="not-prose grid md:grid-cols-1 gap-6 my-8 max-w-2xl">
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
        <p className="text-xl text-white font-serif mb-4">Opening a restaurant or refreshing an existing one? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold !text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your drawings</Link>
      </div>

      <FaqAccordion faqs={faqs} />

      <p className="mt-8">We also deliver <Link to="/fit-out-dubai">commercial fit-out</Link> for offices, clinics and retail across Dubai and Abu Dhabi. <Link to="/contact">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default RestaurantFitOutDubaiPage;
