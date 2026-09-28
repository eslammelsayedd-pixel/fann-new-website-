import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const path = '/exhibition-stands-abu-dhabi';
const pageTitle = 'Exhibition stands in Abu Dhabi, built in-house';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Exhibition Stands Abu Dhabi', path },
];

const deliver = [
  'Custom exhibition stands',
  'Modular exhibition systems',
  'Turnkey exhibition services, design to dismantle',
  'Stand fabrication in our own workshop',
  'Interior fit-out of exhibition spaces',
];

const faqs = [
  { question: 'Which areas do you cover?', answer: "We build exhibition stands across Abu Dhabi's venues, and we also cover Dubai and Al Ain events." },
  { question: 'Do you build the stands yourselves?', answer: 'Yes. Stands are fabricated in our own joinery workshop in Umm Al Quwain, so quality and lead times stay in our hands.' },
  { question: 'Who handles venue and organiser coordination?', answer: 'We do. Venue, organiser and authority coordination is part of every build, whether your stand is in a major exhibition centre or a hotel ballroom.' },
  { question: 'Can you handle the whole show turnkey?', answer: 'Yes. Design, fabrication, transport, installation, on-site support and dismantle sit with one accountable team.' },
  { question: 'What do you need from us to quote?', answer: 'Your stand size, the show and your build-up date, plus any brief or brand guidelines. We return a clear, itemised scope and quotation without a long tender process.' },
];

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      serviceType: 'Exhibition Stand Design and Build',
      name: 'Exhibition Stand Contractor Abu Dhabi',
      description: 'Custom exhibition stands in Abu Dhabi: design, fabrication in an in-house joinery workshop, transport, installation, on-site support and dismantle, delivered turnkey across Abu Dhabi, Dubai and Al Ain.',
      provider: { '@type': 'Organization', name: 'FANN', url: 'https://fann.ae', telephone: '+971505667502', email: 'sales@fann.ae' },
      areaServed: [{ '@type': 'City', name: 'Abu Dhabi' }, { '@type': 'City', name: 'Dubai' }],
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

const ExhibitionStandsAbuDhabiPage: React.FC = () => (
  <AnimatedPage>
    <SEO
      title="Exhibition Stand Contractor Abu Dhabi | FANN"
      description="Custom exhibition stands in Abu Dhabi, designed and built in-house with our own joinery workshop. Turnkey service from design to dismantle. Itemised quotes."
      schema={schema}
    />
    <ServicePageLayout
      heroImage="/images/site/workshop-carpentry.webp"
      heroAltText="Exhibition stand components being built in the FANN workshop"
      pageTitle={pageTitle}
      pageDescription="One accountable team and our own joinery workshop, from first sketch to show opening."
      breadcrumbs={breadcrumbs}
    >
      <p className="lead">FANN is a Dubai design and build company. We design and build custom exhibition stands across Abu Dhabi with one accountable team and our own joinery workshop - from first sketch to show opening.</p>

      <div className="not-prose my-8 text-center">
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get an itemised quote</Link>
      </div>

      <h2>What we deliver</h2>
      <ul className="columns-1 md:columns-2">
        {deliver.map(d => <li key={d}>{d}</li>)}
      </ul>
      <p>Every stand is fabricated in our own workshop, so quality and lead times stay in our hands.</p>

      <h2>Why in-house matters for exhibitions</h2>
      <p>An exhibition build runs on one clock: the show opens whether the stand is ready or not. Our production facility in Umm Al Quwain means your stand is fabricated to one specification, with no third-party joinery lead times and changes turned around in days, not weeks. That is how a stand opens on time, to the standard the design promised.</p>

      <h2>Proven on immovable deadlines</h2>
      <p>FANN builds exhibition stands and event environments for opening dates that cannot move - recent work includes a flagship international automotive event in Dubai and a national education showcase in Abu Dhabi. We plan backwards from your build-up date and deliver to it.</p>
      <div className="not-prose my-8 text-center">
        <Link to="/portfolio" className="text-fann-gold underline underline-offset-4">See the builds in our portfolio</Link>
      </div>

      <h2>One team, start to finish</h2>
      <p>Design, fabrication, transport, installation, on-site support and dismantle sit with one team. You deal with one accountable partner, not a chain of subcontractors. We handle venue, organiser and authority coordination as part of every build.</p>

      <h2>How we quote</h2>
      <p>Per stand, itemised, and fast. Send us your stand size, the show and your build-up date, plus any brief or brand guidelines, and we return a clear scope and quotation without a long tender process.</p>

      <div className="not-prose my-10 p-8 border border-fann-gold/40 rounded-lg text-center">
        <p className="text-xl text-white font-serif mb-4">Exhibiting in Abu Dhabi? Tell us about your stand.</p>
        <p className="text-gray-300 mb-6"><a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a> &middot; <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a></p>
        <Link to="/contact" className="bg-fann-gold text-black font-bold py-3 px-8 rounded-full uppercase tracking-wider inline-block">Send your brief</Link>
      </div>

      <h2>Frequently asked questions</h2>
      <FaqAccordion faqs={faqs} />

      <p className="mt-8">Exhibiting in Dubai instead? See our <Link to="/services/custom-exhibition-stands-dubai">custom exhibition stands in Dubai</Link> and <Link to="/services/turnkey-exhibition-services-uae">turnkey exhibition services</Link>, or browse the <Link to="/portfolio">portfolio</Link>.</p>
    </ServicePageLayout>
  </AnimatedPage>
);

export default ExhibitionStandsAbuDhabiPage;
