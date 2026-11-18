import buyerFaqs from '../../data/buyerScopeFaqs.json';
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';

const path = '/event-setup-dubai';
const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Event Setup Dubai', path },
];
const faqs = buyerFaqs['/event-setup-dubai'];
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Event Setup and Production Build',
      name: 'Event Setup Dubai',
      description: 'Event setup in Dubai: stage and display structures, branded installations, fabrication and site installation, scoped to the event brief and venue.',
      provider: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae' },
      areaServed: { '@type': 'City', name: 'Dubai' },
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

const EventSetupDubaiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Event Setup Dubai | Event Build & Installation | FANN"
      description="Event setup and build in Dubai, from stage and display structures to branded installations. See FANN's documented event work and send your venue, date and brief."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/projects/icons-of-porsche/14.webp"
      heroAltText="LED stage walls and lighting at Icons of Porsche 2025 in Dubai Design District, from FANN's documented event project"
      pageTitle="Event Setup and Build in Dubai"
      pageDescription="FANN designs and builds event setups in Dubai, including stages, display structures and branded installations. The proposed build is scoped around your venue, visitor activities, technical interfaces and actual installation window."
      heroAction={{label:'Discuss your event build',path:'/contact'}}
      breadcrumbs={breadcrumbs}
    >
      <section><h2>Start with the audience route and the site</h2><p>Mark entrances, audience areas, product displays, demonstrations, circulation and any back-of-house needs on the event plan. For each proposed build element, record what visitors and staff will do there. Use that brief to discuss the layout and finishes without assuming every site needs the same structures or production package.</p></section>
      <section><h2>Give every interface an owner</h2><p>Separate scenic and display construction from screens, sound, lighting, rigging, power and venue services. Name who supplies each element, who provides the drawings and who checks the interface. Include other suppliers in the sequence before releasing work that depends on their dimensions, access or installation.</p></section>
      <section><h2>Use the current site information</h2><p>Send the venue instructions, current floor plan and actual submission, delivery, installation and removal windows. For outdoor locations, identify the site conditions and project-specific checks with the responsible parties. A previous event build does not establish the approval, fixing method or structural suitability of the next installation.</p></section>
      <section><h2>Record the handover and the return scope</h2><p>Agree who checks the installed build, how outstanding work is recorded and when the event team takes over. Include dismantling, return transport, retained items and any storage only where agreed. If the layout, artwork or technical brief changes, confirm the affected scope and programme before proceeding.</p></section>
      <p>For a trade-show booth rather than a wider event environment, see our <Link to="/services/custom-exhibition-stands-dubai">exhibition stand design and build</Link> service.</p>
      <h2>A documented event build</h2>
      <p>At Icons of Porsche 2025 in Dubai Design District, FANN's documented build included stage LED walls, display structures and installations across the outdoor event environment. The project page shows the work and its photographs; it is an example of a delivered event, not a template for your venue.</p>
      <figure className="not-prose my-8 overflow-hidden rounded-lg border border-white/10">
        <img src="/images/projects/icons-of-porsche/14.webp" alt="Stage LED walls and lighting at Icons of Porsche 2025, Dubai Design District" loading="lazy" width="1600" height="900" className="w-full object-cover" />
        <figcaption className="px-4 py-3 text-sm text-gray-300">Icons of Porsche 2025, Dubai Design District. <Link to="/portfolio/icons-of-porsche-2025-dubai" className="text-fann-gold underline">See the event build</Link>.</figcaption>
      </figure>
      <h2>Prepare an event-build scope</h2>
      <ol><li>Send the venue, event plan, intended activities and actual access windows.</li><li>Identify the build elements and the suppliers responsible for technical services.</li><li>Agree drawings, materials, artwork and submission responsibilities.</li><li>Confirm installation, checks, handover and any after-event work in the proposal.</li></ol>
      <div className="not-prose my-10 text-center">
        <Link to="/contact" className="inline-block rounded-full bg-fann-gold px-8 py-4 font-bold uppercase tracking-wide text-black">Send your event brief</Link>
      </div>
      <FaqAccordion faqs={faqs} />
      <h2>Related build planning</h2><ul><li><Link to="/services/exhibition-stand-fabrication-dubai">Fabrication and production release</Link></li><li><Link to="/services/turnkey-exhibition-services-uae">Coordinated exhibition project scope</Link></li><li><Link to="/services/interior-fitout-exhibition-spaces-dubai">Exhibition-space finishing</Link></li></ul>
    </ServicePageLayout>
  </AnimatedPage>
);

export default EventSetupDubaiPage;
