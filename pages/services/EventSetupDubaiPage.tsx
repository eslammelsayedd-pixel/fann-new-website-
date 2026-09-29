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
const faqs = [
  { question: 'What information do you need for an event setup quote?', answer: 'Send the event date, venue, floor plan if available, the areas to be built, brand assets and your installation and dismantling windows. We can then define the build scope and price.' },
  { question: 'Do you work on outdoor and indoor events?', answer: 'We can review briefs for both. The build plan depends on the venue, site conditions, access and the agreed technical scope.' },
  { question: 'Can you handle only part of an event build?', answer: 'Yes. Share the elements you need, such as a stage, display area or branded installation, and we will define what FANN will supply and install.' },
  { question: 'When should we contact you?', answer: 'Once the event date, venue and brief are known. Lead time depends on the design, approvals, fabrication and site access, so we will check the schedule against your scope.' },
];
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
      pageDescription="Stage, display and branded structures built around your event brief, venue and opening date."
      breadcrumbs={breadcrumbs}
    >
      <h2>Build the parts your audience will use</h2>
      <p>An event setup begins with the visitor journey and the site. FANN works on stages, display structures and branded installations for events in Dubai. We plan the build around your venue, floor plan, technical brief and opening date. The exact scope, including third-party production and approvals, is set out in the proposal.</p>
      <p>For a trade-show booth rather than a wider event environment, see our <Link to="/services/custom-exhibition-stands-dubai">exhibition stand design and build</Link> service.</p>
      <h2>What an event build can include</h2>
      <ul>
        <li>Stage decks, scenic structures and presentation backdrops</li>
        <li>Branded entrances, display zones and wayfinding elements</li>
        <li>Custom structures for audience, product and demonstration areas</li>
        <li>Fabrication, transport, on-site installation and handover for the agreed scope</li>
      </ul>
      <p>Lighting, screens, rigging, power and other technical elements are planned with the venue and the relevant suppliers for each brief. We do not assume every event needs the same package.</p>
      <h2>A documented event build</h2>
      <p>At Icons of Porsche 2025 in Dubai Design District, FANN's documented build included stage LED walls, display structures and installations across the outdoor event environment. The project page shows the work and its photographs; it is an example of a delivered event, not a template for your venue.</p>
      <figure className="not-prose my-8 overflow-hidden rounded-lg border border-white/10">
        <img src="/images/projects/icons-of-porsche/14.webp" alt="Stage LED walls and lighting at Icons of Porsche 2025, Dubai Design District" loading="lazy" width="1600" height="900" className="w-full object-cover" />
        <figcaption className="px-4 py-3 text-sm text-gray-300">Icons of Porsche 2025, Dubai Design District. <Link to="/portfolio/icons-of-porsche-2025-dubai" className="text-fann-gold underline">See the event build</Link>.</figcaption>
      </figure>
      <h2>From brief to site handover</h2>
      <ol>
        <li><strong>Brief:</strong> Share your event date, venue, audience flow, floor plan and the structures you need.</li>
        <li><strong>Design and scope:</strong> We define the build elements, materials, technical interfaces and quote.</li>
        <li><strong>Site planning:</strong> We align drawings, production and installation with venue access and the agreed approvals.</li>
        <li><strong>Build and handover:</strong> The approved elements are fabricated and installed, then checked before the event opens. Dismantling is included when agreed in the scope.</li>
      </ol>
      <div className="not-prose my-10 text-center">
        <Link to="/contact" className="inline-block rounded-full bg-fann-gold px-8 py-4 font-bold uppercase tracking-wide text-black">Send your event brief</Link>
      </div>
      <FaqAccordion faqs={faqs} />
    </ServicePageLayout>
  </AnimatedPage>
);

export default EventSetupDubaiPage;
