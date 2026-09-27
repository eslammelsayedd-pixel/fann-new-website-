import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const pageTitle = 'Custom Exhibition Stands Dubai';
const heroImage = '/images/stands/1-trevos-light-middle-east.webp';
const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: pageTitle, path: '/services/custom-exhibition-stands-dubai' }
];

const standPhotos = [
  { file: '1-trevos-light-middle-east', name: 'TREVOS', event: 'Light Middle East', place: 'Dubai', year: '2023' },
  { file: '2-bayara-gulfood', name: 'Bayara', event: 'Gulfood', place: 'Dubai', year: '2020' },
  { file: '3-awazel-big-5', name: 'Awazel', event: 'The Big 5', place: 'Dubai', year: '2012' },
  { file: '4-saudi-ceramics-big-5', name: 'Saudi Ceramics', event: 'The Big 5', place: 'Dubai', year: '2019' },
  { file: '5-apollo-tyres-automechanika', name: 'Apollo Tyres', event: 'Automechanika', place: 'Dubai', year: '2016' },
  { file: '6-geven-aircraft-interiors', name: 'Geven', event: 'Aircraft Interiors Middle East', place: 'Dubai', year: '2025' },
  { file: '7-dubai-properties-cityscape', name: 'Dubai Properties Group', event: 'Cityscape', place: 'Dubai' },
  { file: '8-india-pavilion-gulfood', name: 'India Pavilion', event: 'Gulfood', place: 'Dubai' },
  { file: '9-abbott-arab-health', name: 'Abbott', event: 'Arab Health', place: 'Dubai' }
];

const faqs = [
  { question: 'What details do you need to quote a custom stand?', answer: 'Send us the show name, venue, stand size and deadline. A floor plan, brand guidelines and the functions your stand needs will help us shape the brief and quote.' },
  { question: 'How does the design and build process work?', answer: 'We start with your brief and site requirements, develop a concept, agree the scope and drawings, then fabricate and install the approved build. Venue requirements and the installation window are checked for each project.' },
  { question: 'Can FANN build and install the stand?', answer: 'FANN offers design, fabrication and on-site installation for exhibition projects. The exact scope, venue submissions and handover schedule are agreed for your show.' },
  { question: 'When should I get in touch?', answer: 'As soon as you have a show, venue and stand allocation. Lead times vary with the design, approvals, production scope and venue access, so share your deadline rather than relying on a standard turnaround.' },
  { question: 'Is a custom build different from a modular stand?', answer: 'A custom build is designed around your specific layout and use. A modular system uses reusable components. We can discuss which approach fits the floor plan, brief and future show plans.' }
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Custom Exhibition Stand Design and Build',
      name: pageTitle,
      description: 'FANN designs, fabricates and installs custom exhibition stands in Dubai, with scope planned around the show brief and venue requirements.',
      provider: { '@type': 'Organization', name: 'FANN' },
      areaServed: { '@type': 'City', name: 'Dubai' }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem', position: index + 1, name: crumb.name, item: `https://fann.ae${crumb.path}`
      }))
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question', name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    }
  ]
};

const CustomStandsPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Custom Exhibition Stands Dubai | Design & Build | FANN"
      description="Custom exhibition stand design, fabrication and installation in Dubai. See real FANN exhibition and event builds, then share your show, venue, size and deadline."
      schema={schema}
    />
    <ServicePageLayout
      heroImage={heroImage}
      heroAltText="TREVOS exhibition stand at Light Middle East, Dubai (2023), from FANN's supplied project archive"
      pageTitle="Custom Exhibition Stands in Dubai"
      pageDescription="Design, fabrication and installation planned around your show, floor plan and opening date."
      breadcrumbs={breadcrumbs}
    >
      <h2>Built around the show brief</h2>
      <p>A custom stand starts with the space you have and the work it needs to do: product display, visitor flow, meetings or a demonstration area. FANN develops the design and build scope around your stand allocation, brand materials and venue requirements. If a reusable approach is a better fit, we can also discuss <Link to="/services/modular-exhibition-systems-dubai">modular exhibition systems</Link>.</p>
      <p>Our Dubai office coordinates the project; fabrication is supported by our workshop in Umm Al Quwain. We plan the build and installation against your show deadline rather than assuming every venue has the same access or approval process.</p>

      <h2>From floor plan to handover</h2>
      <ol>
        <li><strong>Brief and site details:</strong> Share your show, venue, stand size, deadline, floor plan and what visitors should be able to do in the space.</li>
        <li><strong>Concept and scope:</strong> We develop a layout and visual direction, then agree the materials, graphics and build scope before production.</li>
        <li><strong>Technical planning:</strong> Drawings, logistics and venue submission needs are checked against the agreed design and show schedule.</li>
        <li><strong>Fabrication:</strong> Our <Link to="/services/exhibition-stand-fabrication-dubai">fabrication team</Link> produces the approved elements and prepares them for site installation.</li>
        <li><strong>Installation and handover:</strong> We coordinate the on-site build and check the finished space before opening. Dismantling can be included in the agreed scope.</li>
      </ol>

      <h2>Exhibition stands from FANN's project archive</h2>
      <p>These stand photographs and captions come from the exhibition profile you supplied. Each name stays with its original image; a year is shown only where that profile states it. The photos show stand environments, not a promise of a specific layout or feature for your project.</p>
      <div className="not-prose grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
        {standPhotos.map(({ file, name, event, place, year }) => (
          <figure key={file} className="overflow-hidden rounded-lg border border-white/10 bg-fann-charcoal-light">
            <img src={`/images/stands/${file}.webp`} alt={`${name} exhibition stand photographed at ${event}, ${place}${year ? ` (${year})` : ''}`} loading="lazy" decoding="async" width="1600" height="1400" className="w-full aspect-[8/7] object-cover" />
            <figcaption className="px-4 py-4 text-white">
              <strong className="block text-base text-fann-gold">{name}</strong>
              <span className="block mt-1 text-sm text-gray-300">{event}, {place}{year ? ` (${year})` : ''}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-sm">Source: FANN Profile A, exhibition and events, selected work pages 8, 9, 11, 13, 14, 16, 18, 19 and 20. Photos were adjusted for web display, without changing the stands.</p>

      <h2>See the build quality in completed projects</h2>
      <p>These are documented event and exhibition environments, not examples of a standard trade-show booth or a promise that every stand will include the same features:</p>
      <ul>
        <li><Link to="/portfolio/icons-of-porsche-2025-dubai">Outdoor event structures at Dubai Design District, Dubai (2025)</Link> - a timber entrance, display structures and stage environments.</li>
        <li><Link to="/portfolio/special-olympics-uae-unified-champion-schools-2025">Award ceremony build, UAE (2025)</Link> - sculpted stage arches, portrait panels and a lit stage.</li>
        <li><Link to="/portfolio/national-expression-adek-abu-dhabi">Walk-through exhibition gallery, Abu Dhabi</Link> - curved display walls, artwork lighting and seating islands.</li>
      </ul>
      <p>Browse the <Link to="/portfolio">portfolio</Link> for project photography. We will shape your stand proposal around your own show requirements.</p>

      <h2>Request a stand proposal</h2>
      <p>Tell us your <strong>show, venue, stand size and deadline</strong>. Include a floor plan or brief if you have one. We can then discuss the design and build scope and prepare a quote for your project.</p>
      <div className="my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Send your show brief</Link>
      </div>
      <FaqAccordion faqs={faqs} />
    </ServicePageLayout>
  </AnimatedPage>
);

export default CustomStandsPage;
