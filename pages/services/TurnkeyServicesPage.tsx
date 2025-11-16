import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const pageTitle = "Turnkey Exhibition Services UAE";
const heroImage = "https://images.pexels.com/photos/8199563/pexels-photo-8199563.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: pageTitle, path: '/services/turnkey-exhibition-services-uae' }
];

const faqs = [
  { question: "What does 'turnkey exhibition service' actually mean?", answer: "A turnkey service means we handle every single aspect of your exhibition presence. From the moment you sign the contract, we take care of design, authority approvals, fabrication, graphics, AV, furniture, on-site installation, and post-show dismantling. You get one dedicated project manager and one invoice, allowing you to focus on your business, not on managing multiple vendors." },
  { question: "Is a turnkey solution more expensive than managing vendors myself?", answer: "While the initial quote might seem higher, a turnkey solution is often more cost-effective in the long run. We leverage our industry relationships for better pricing on materials and services. More importantly, it saves you dozens, if not hundreds, of hours of your team's valuable time, which has a significant cost." },
  { question: "What is included in a standard FANN turnkey package?", answer: "Our comprehensive package includes: dedicated project management, bespoke 3D stand design and revisions, all necessary venue and authority approvals, in-house fabrication, graphics production, flooring, lighting, standard furniture rental, AV equipment rental, on-site installation, and complete dismantling and site clearance." },
  { question: "How do you handle project management and communication?", answer: "You will be assigned a dedicated, experienced project manager who will be your single point of contact. We provide a detailed project timeline and schedule regular check-ins. You will have access to your project manager 24/7 during the critical build-up phase for complete peace of mind." },
  { question: "Do you handle logistics and shipping of our products to the stand?", answer: "While our core service focuses on the stand itself, we can absolutely coordinate with your logistics provider or recommend one of our trusted partners to ensure your products arrive safely and are integrated into the stand design as planned." },
  { question: "What about other services like hospitality and staffing?", answer: "We can extend our turnkey solution to include additional services through our network of trusted partners. This includes catering and hospitality services, professional hostesses and promoters, and lead capture technology rental. Just let us know your requirements." },
  { question: "Why is having a single partner so important in the UAE market?", answer: "The UAE exhibition market involves navigating complex regulations with multiple authorities (venue, municipality, civil defense, etc.). An experienced turnkey provider like FANN understands these processes intimately, ensuring your project is fully compliant and avoids costly delays or on-site issues." },
  { question: "Can a turnkey service be used for a modular stand?", answer: "Yes. Our turnkey management services apply to both custom and modular stands. For modular stands, the service would also include the management of your assets, storage between shows, and re-configuration design for different booth sizes." }
];

const schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Service",
            "serviceType": "Turnkey Exhibition Services",
            "name": "Turnkey Exhibition Services UAE",
            "description": "FANN offers complete turnkey exhibition services across the UAE. Our end-to-end solution covers design, fabrication, project management, logistics, and dismantling for a seamless and stress-free exhibition experience.",
            "provider": { "@type": "Organization", "name": "FANN" },
            "areaServed": { "@type": "Country", "name": "United Arab Emirates" },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Turnkey Service Inclusions",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "End-to-End Project Management" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Stand Design & Fabrication" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Venue & Authority Approvals" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Logistics & On-Site Build" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Post-Show Dismantling" } }
                ]
            }
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

const TurnkeyServicesPage: React.FC = () => {
  return (
    <AnimatedPage>
      <SEO
        title="Turnkey Exhibition Services UAE | Complete Stand Solutions | FANN"
        description="Complete turnkey exhibition services in the UAE. From design and fabrication to logistics and dismantling. A single point of contact for a stress-free exhibition."
        schema={schema}
      />
      <ServicePageLayout
        heroImage={heroImage}
        heroAltText="A dedicated exhibition project manager from FANN overseeing a stand installation."
        pageTitle="Full Turnkey Exhibition Services in the UAE"
        pageDescription="Your single, expert partner for a flawless exhibition experience. We manage every detail, so you can focus on what matters most: your business."
        breadcrumbs={breadcrumbs}
      >
        <h2>The Turnkey Advantage: One Partner, Zero Hassle</h2>
        <p>Exhibiting at a major trade show in the UAE involves coordinating dozens of moving parts, from design and fabrication to navigating complex venue regulations and logistics. A <strong>turnkey exhibition service</strong> eliminates this complexity. FANN acts as your single, dedicated partner, taking complete ownership of the entire project lifecycle. We provide one expert point of contact, one comprehensive proposal, and one final invoice. This streamlined approach saves you time, reduces stress, and ensures a cohesive, high-quality result without the headache of managing multiple vendors and contractors.</p>

        <div className="my-8 text-center">
            <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Request a Turnkey Proposal</Link>
        </div>

        <h2>Our End-to-End Process</h2>
        <p>Our proven turnkey process ensures nothing is left to chance. We guide you seamlessly from initial idea to post-show wrap-up:</p>
        <ol>
            <li><strong>Consultation & Strategy:</strong> We begin by understanding your goals to develop a comprehensive project strategy and timeline.</li>
            <li><strong>Design & Approval:</strong> Our team creates a stunning <Link to="/services/custom-exhibition-stands-dubai">custom stand design</Link> and manages all submissions for venue and government authority approvals.</li>
            <li><strong>Fabrication & Production:</strong> Your stand is built to the highest standards in our <Link to="/services/exhibition-stand-fabrication-dubai">in-house workshop</Link>, where we also produce all graphics and branding elements.</li>
            <li><strong>Logistics & Coordination:</strong> We handle all logistics, including transport of the stand to the venue, and coordinate with all third parties, such as electricity and rigging suppliers.</li>
            <li><strong>On-Site Build & Management:</strong> Our on-site team manages the entire build-up, ensuring every element is installed perfectly and on schedule.</li>
            <li><strong>Handover & Support:</strong> We conduct a final walkthrough with you and remain on-call throughout the event for any support you may need.</li>
            <li><strong>Dismantling & Storage:</strong> After the show, we efficiently dismantle the stand and can arrange for storage of reusable components.</li>
        </ol>

        <h2>What's Included in Our Turnkey Package?</h2>
        <p>Our goal is to provide a complete, worry-free solution. A standard FANN turnkey package includes:</p>
        <ul>
            <li><strong>Dedicated Project Manager:</strong> Your single point of contact from start to finish.</li>
            <li><strong>Full Stand Design:</strong> Including 3D renders and technical drawings.</li>
            <li><strong>Complete Fabrication & Graphics:</strong> Built and printed in-house for quality control.</li>
            <li><strong>Flooring, Lighting & Basic AV:</strong> All essential electrical and structural elements.</li>
            <li><strong>Furniture Rental:</strong> Sourcing from our catalogue of high-quality furniture.</li>
            <li><strong>All Authority Approvals:</strong> Navigating the complex paperwork with DWTC, ADNEC, and other authorities.</li>
            <li><strong>Transportation & On-Site Installation:</strong> Full logistical management.</li>
            <li><strong>Post-Show Dismantling & Site Clearance:</strong> Ensuring you meet all venue obligations.</li>
        </ul>
        <p>We can also integrate additional services like advanced AV, hospitality, and staffing to create a truly all-inclusive package tailored to your needs.</p>
        
        <div className="my-8 text-center">
            <Link to="/portfolio" className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">See Our Turnkey Projects</Link>
        </div>

        <h2>Expert Project Management & Communication</h2>
        <p>The cornerstone of a successful turnkey service is flawless project management. At FANN, every project is led by an experienced manager who is an expert in the local exhibition landscape. They are responsible for creating detailed timelines, managing budgets, and ensuring every milestone is met. We believe in proactive communication, providing you with regular updates and a clear view of the project's progress, so you're always informed but never burdened with the minor details.</p>

        <FaqAccordion faqs={faqs} />
      </ServicePageLayout>
    </AnimatedPage>
  );
};

export default TurnkeyServicesPage;
