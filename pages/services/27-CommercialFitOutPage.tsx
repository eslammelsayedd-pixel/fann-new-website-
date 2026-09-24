import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/services/commercial-interior-fit-out-dubai';
const pageTitle = 'Commercial Interior Fit-Out in Dubai & Abu Dhabi';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Commercial Fit-Out', path },
];

const sectors = [
  { title: 'Offices', img: '/images/site/fitout-executive-office.webp', alt: 'Executive office fit-out with timber wall panels and meeting table', text: 'Open-plan work areas, meeting rooms, reception and executive offices. Joinery, glass partitions, ceilings, lighting and power, delivered with minimal downtime for your team.' },
  { title: 'Clinics & medical centres', img: '/images/site/fitout-clinic-hall.webp', alt: 'Bright clinic corridor with clean finishes and display shelving', text: 'Reception and waiting areas, consultation rooms, treatment rooms and pharmacy counters. Clean, easy-to-maintain finishes and layouts planned around patient flow and the approvals your clinic licence needs.' },
  { title: 'Schools & nurseries', img: '/images/site/fitout-office-wood-panel.webp', alt: 'Warm interior with timber panelling and soft seating', text: 'Classrooms, activity rooms, libraries and staff areas. Durable, child-safe materials, rounded edges, good acoustics and lighting, and work planned around term dates.' },
  { title: 'Small & mid-size businesses', img: '/images/site/workshop-carpentry.webp', alt: 'Carpenter cutting timber in the FANN joinery workshop', text: 'Showrooms, retail units, cafes, salons and service offices. Clear fixed quotes, practical designs that fit the budget, and one team from design to handover.' },
];

const faqs = [
  { question: 'Which areas do you cover for fit-out?', answer: 'We deliver commercial fit-out projects across Dubai and Abu Dhabi.' },
  { question: 'Do you handle design as well as the build?', answer: 'Yes. We can start from your idea, a landlord layout or an existing design. We prepare the layout, 3D visuals and material choices, then build it with our own team and workshop.' },
  { question: 'Can you help with authority approvals?', answer: 'Yes. We prepare the fit-out drawings and coordinate with the landlord and the relevant authorities for your project type. For clinics and schools, tell us your licensing authority at the start so the design meets its requirements from day one.' },
  { question: 'How long does a typical fit-out take?', answer: 'It depends on size, approvals and materials. After a site visit we give you a written programme with key dates, so you can plan your opening.' },
  { question: 'Do you make your own joinery?', answer: 'Yes. Reception desks, counters, wall panels, storage and display units are made in our own workshop, which helps us control quality and timing.' },
  { question: 'How do I get a quote?', answer: 'Send us your floor plan or location and a short brief through the form or WhatsApp. We will arrange a site visit and send a detailed quote.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Commercial Interior Fit-Out',
      name: pageTitle,
      description: 'Design and build interior fit-out for offices, clinics, schools and small businesses in Dubai and Abu Dhabi.',
      provider: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae' },
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

const CommercialFitOutPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Commercial Fit-Out Dubai & Abu Dhabi | Offices, Clinics, Schools"
      description="Design and build fit-out for offices, clinics, schools and small businesses in Dubai and Abu Dhabi. Own joinery workshop, one team from design to handover."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/fitout-executive-office.webp"
      heroAltText="Modern office interior fit-out with timber panels and designer lighting"
      pageTitle={pageTitle}
      pageDescription="Offices, clinics, schools and small businesses. Designed, built and handed over by one team."
      breadcrumbs={breadcrumbs}
    >
      <h2>Fit-out for the spaces your business runs on</h2>
      <p>FANN designs and builds commercial interiors across Dubai and Abu Dhabi. We take an empty unit or an old layout and hand back a finished space: ceilings, partitions, flooring, lighting, joinery, furniture and branding. Because we build our own joinery in our workshop, we control quality and dates instead of waiting on subcontractors.</p>

      <h2>Sectors we fit out</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-6 my-8">
        {sectors.map(s => (
          <div key={s.title} className="bg-fann-charcoal-light border border-white/10 rounded-lg overflow-hidden">
            <img src={s.img} alt={s.alt} loading="lazy" className="w-full aspect-video object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-serif text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>How a project runs</h2>
      <ol>
        <li><strong>Site visit and brief:</strong> we measure the space, check landlord rules and agree budget and dates.</li>
        <li><strong>Design:</strong> layout, 3D visuals, materials and a detailed quote.</li>
        <li><strong>Approvals:</strong> drawings and coordination with the landlord and authorities.</li>
        <li><strong>Build:</strong> our site team and workshop deliver the works, with weekly progress updates.</li>
        <li><strong>Handover:</strong> snagging, cleaning and a walk-through before you open.</li>
      </ol>

      <div className="my-8 text-center">
        <Link to="/book-consultation" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Book a free site visit</Link>
      </div>

      <h2>Frequently asked questions</h2>
      <FaqAccordion faqs={faqs} />

      <p className="mt-8">Planning an exhibition instead? See our <Link to="/services/custom-exhibition-stands-dubai">custom exhibition stands</Link> and <Link to="/services/interior-fitout-exhibition-spaces-dubai">exhibition space fit-out</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default CommercialFitOutPage;
