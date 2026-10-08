import buyerFaqs from '../../data/buyerScopeFaqs.json';
import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const pageTitle = "Exhibition Stand Fabrication Dubai";
const heroImage = '/images/stands/1-trevos-light-middle-east.webp';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: pageTitle, path: '/services/exhibition-stand-fabrication-dubai' }
];

const faqs = buyerFaqs['/services/exhibition-stand-fabrication-dubai'];

const schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Service",
            "serviceType": "Exhibition Stand Fabrication",
            "name": "Exhibition Stand Fabrication Dubai",
            "description": "FANN offers expert exhibition stand fabrication in Dubai from our in-house workshop in Umm Al Quwain. The production scope, materials, approvals and installation schedule are agreed for each show.",
            "provider": { "@type": "Organization", "name": "FANN" },
            "areaServed": { "@type": "City", "name": "Dubai" }
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": `https://fann.ae${crumb.path}`
            }))
        },
        {
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        }
    ]
};

const FabricationPage: React.FC = () => {
  return (
    <AnimatedPage>
      <SEO
        title="Exhibition Stand Fabrication Dubai | In-House Production | FANN"
        description="Exhibition stand fabrication for Dubai shows, supported by FANN's workshop in Umm Al Quwain. Send your drawings, stand size, venue and deadline for a scoped quote."
        schema={schema}
      />
      <ServicePageLayout
        heroImage={heroImage}
        heroAltText="TREVOS completed stand at Light Middle East, Dubai, 2023. Project reference, not a workshop photograph."
        pageTitle="Exhibition Stand Fabrication for Dubai Shows"
        pageDescription="Production supported by our workshop in Umm Al Quwain, scoped around your drawings, venue and opening date."
        heroAction={{ label: "Share your fabrication brief", path: "/exhibition-stand-quote" }}
        breadcrumbs={breadcrumbs}
      >
        <h2>From approved drawings to the exhibition floor</h2>
        <p>FANN supports exhibition stand fabrication for Dubai shows through its in-house joinery workshop in Umm Al Quwain. Our Dubai office coordinates the project. The production and installation scope is agreed around the stand allocation, approved design and venue access, rather than a standard promise for every build.</p>
        <p>Send your show, venue, dimensions, open sides, drawings, graphics requirements and deadline. If you need the concept developed as well, see our <Link to="/services/custom-exhibition-stands-dubai">custom exhibition stand design and build service</Link>.</p>
        <h2>Agree the fabrication scope before production</h2>
        <ol>
          <li><strong>Drawings and responsibilities:</strong> Identify what FANN will fabricate and what the exhibitor or another supplier will provide.</li>
          <li><strong>Materials and finishes:</strong> Confirm the specification, quantities, finish expectations and any sample approval in the quote.</li>
          <li><strong>Venue requirements:</strong> Check the current exhibitor manual, submission dates, fire documentation, loads and electrical requirements for the actual design.</li>
          <li><strong>Production and site access:</strong> Agree the dependencies, transport, installation window and handover checks. Dismantling is included only when stated.</li>
        </ol>
        <h2>TREVOS at Light Middle East</h2>
        <figure className="not-prose my-8">
          <img src="/images/stands/1-trevos-light-middle-east.webp" alt="TREVOS stand at Light Middle East, Dubai, 2023, from FANN's supplied project archive" loading="lazy" width="1600" height="1400" className="w-full rounded-md" />
          <figcaption className="mt-3 text-sm text-gray-500 dark:text-gray-300">TREVOS, Light Middle East, Dubai, 2023. The completed project photo shows the stand layout; it does not establish workshop machinery, material grades, structural capacity or a production duration.</figcaption>
        </figure>
        <p><Link to="/portfolio/trevos-light-middle-east">See the TREVOS project reference</Link> and the <Link to="/portfolio">FANN portfolio</Link>. The new build will be quoted against your own brief, not inferred from this photograph.</p>
        <h2>What to confirm in the quote</h2>
        <p>Confirm graphics, transport, installation, venue submissions and any dismantling separately. Organiser charges, power, rigging, furniture, AV, storage and changes after design approval should be named as included, excluded or supplied by others. A fabrication quote is not a guarantee of venue approval or a fixed completion date before the dependencies are checked.</p>
        <div className="my-8 text-center">
          <Link to="/exhibition-stand-quote" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-fann-gold px-7 py-3 font-bold text-black">Share your fabrication brief</Link>
        </div>

        <FaqAccordion faqs={faqs} />
      </ServicePageLayout>
    </AnimatedPage>
  );
};

export default FabricationPage;
