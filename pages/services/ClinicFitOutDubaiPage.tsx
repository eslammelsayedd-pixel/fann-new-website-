import clinicScope from '../../data/clinicScopePage.json';
import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/clinic-fit-out-dubai';
const pageTitle = clinicScope.heading;

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Clinic Fit-Out Dubai', path },
];

const deliver = [
  'Reception desks and waiting-area joinery',
  'Treatment-room cabinetry and storage',
  'Partitions and ceilings',
  'Flooring',
  'Lighting and MEP coordination',
  'Final finishes',
];

const proof = [
  {
    "img": "/images/projects/109-fitout-572a19833891731b140968ccbb6bd3b78b4570f9.webp",
    "alt": "Aspris Clinic - City Walk reception and waiting area",
    "caption": "Aspris Clinic - City Walk - Dubai, 2024",
    "link": "/portfolio/fit-out/30-aspris-clinic-city-walk"
  },
  {
    "img": "/images/projects/64-fitout-3bed79aee39856ea7c83d87302447f75b0b90090.webp",
    "alt": "Fayy Health Polyclinic reception and waiting area",
    "caption": "Fayy Health Polyclinic - Dubai, 2023",
    "link": "/portfolio/fit-out/29-fayy-health-polyclinic"
  },
  {
    "img": "/images/projects/96-fitout-4d59f51e4198cdeccf796cbf13dfb3f794a9b3bd.webp",
    "alt": "American Hospital Clinic, Dubai Hills reception and waiting area",
    "caption": "American Hospital Clinic, Dubai Hills - Dubai, 2022",
    "link": "/portfolio/fit-out/28-healthcare-clinic-interior"
  }
];

const concepts = [
  { img: '/images/concepts/clinic.webp', title: 'Clinic reception', text: 'Curved reception desk with fluted oak front, terrazzo floor, calm sage palette and a waiting lounge planned around patient flow.' },
];

const faqs = clinicScope.faqs;

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Clinic Fit-Out',
      name: 'Clinic Fit-Out Contractor Dubai',
      description: clinicScope.description,
      provider: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae', telephone: '+971505667502', email: 'business@fann.ae' },
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

const ClinicFitOutDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title={clinicScope.title}
      description={clinicScope.description}
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Joinery being cut in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription={clinicScope.subheading}
      heroAction={{label: 'Email your clinic brief', path: 'mailto:business@fann.ae?subject=Dubai%20medical%20clinic%20fit-out%20brief'}}
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">{clinicScope.intro}</p>
      {clinicScope.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}
      <h2>Define the quoted work</h2><ul>{deliver.map(d => <li key={d}>{d}</li>)}</ul>
      <p>Identify the included areas, materials, service interfaces, exclusions and coordination responsibilities in the proposal. Equipment supply and any specialist requirements need confirmation for this facility.</p>
      <h2>Completed clinic fit-out project references in Dubai</h2>
      <p>Explore completed healthcare project galleries for Aspris Clinic at City Walk, Fayy Health Polyclinic and American Hospital Clinic at Dubai Hills. Use the reception, waiting-area and circulation photographs to brief your own clinic. The design concept below is shown separately.</p>
      <div className="not-prose grid md:grid-cols-3 gap-6 my-8">
        {proof.map(p => (
          <Link key={p.img} to={p.link} className="block bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden hover:border-fann-gold transition-colors">
            <img src={p.img} alt={p.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <p className="p-4 text-sm text-gray-300">{p.caption}</p>
          </Link>
        ))}
      </div>

      <h2 id="design-concepts">Design concept</h2>
      <p>This is a design concept created by FANN to show how we approach clinic interiors. It is a concept visual, not a photo of a completed project. We design every fit-out around your brand, site and budget, and we can prepare a concept like this for your space before you commit.</p>
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
        <p className="text-xl text-white font-serif mb-4">Opening a clinic or refreshing an existing one? Tell us about it.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:business@fann.ae" className="text-fann-gold">business@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="mailto:business@fann.ae?subject=Dubai%20medical%20clinic%20fit-out%20brief" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Email your drawings</Link>
      </div>

      <FaqAccordion faqs={faqs} />

      <p className="mt-8">Planning several clinical services? Read the <Link to="/medical-centre-fit-out-dubai">medical centre room-planning guide</Link>. We also deliver <Link to="/fit-out-dubai">commercial fit-out</Link> and <Link to="/restaurant-fit-out-dubai">restaurant fit-out</Link> across Dubai and Abu Dhabi. <Link to="mailto:business@fann.ae?subject=Dubai%20medical%20clinic%20fit-out%20brief">Tell us about your space</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default ClinicFitOutDubaiPage;
