import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const pageTitle = "Exhibition Stand Fabrication Dubai";
const heroImage = "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: pageTitle, path: '/services/exhibition-stand-fabrication-dubai' }
];

const faqs = [
  { question: "Why is in-house fabrication better than outsourcing?", answer: "In-house fabrication gives us direct control over three critical factors: quality, timeline, and cost. We are not dependent on third-party schedules or quality standards. This allows us to guarantee superior craftsmanship, make agile adjustments, and ensure your stand is delivered on time and on budget." },
  { question: "What kind of machinery do you have in your workshop?", answer: "Our state-of-the-art workshop is equipped with advanced machinery including CNC routers for precision cutting, laser engraving machines, a full-service paint booth for custom finishes, and a comprehensive set of woodworking and metalworking tools to handle any design complexity." },
  { question: "How do you ensure the quality of the materials used?", answer: "We have long-standing relationships with a network of trusted, premium suppliers in the UAE. All materials are inspected upon arrival to our workshop, and we only use high-grade wood, metals, laminates, and acrylics that meet our strict durability and aesthetic standards." },
  { question: "What is your quality control process during manufacturing?", answer: "Quality control is a multi-stage process. It begins with the technical drawings, is checked at each stage of manufacturing (cutting, assembly, finishing), and culminates in a pre-build assembly in our workshop. This allows us to identify and resolve any issues before the stand even reaches the exhibition hall." },
  { question: "Can you handle last-minute changes to the design?", answer: "Our in-house capabilities provide us with greater flexibility to accommodate last-minute changes compared to companies that outsource. While significant changes may have cost and time implications, we can often make minor adjustments quickly without jeopardizing the project timeline." },
  { question: "Are your fabrication processes safe and compliant?", answer: "Yes. Safety is our top priority. Our workshop adheres to strict safety protocols, and our team is fully trained. All stands are engineered to meet the stringent structural and fire safety regulations required by Dubai venues like the DWTC." },
  { question: "How long does the fabrication of a typical stand take?", answer: "For a medium-sized custom stand (e.g., 50-100sqm), the fabrication and finishing process typically takes 2-3 weeks within our workshop, following the final approval of the design and technical drawings." },
  { question: "Can I visit the workshop to see my stand being built?", answer: "Absolutely! We encourage our clients to schedule a visit to our workshop during the production phase. It's a great opportunity to see the craftsmanship firsthand and witness your vision coming to life." }
];

const schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Service",
            "serviceType": "Exhibition Stand Fabrication",
            "name": "Exhibition Stand Fabrication Dubai",
            "description": "FANN offers expert exhibition stand fabrication in Dubai from our state-of-the-art, in-house workshop. Our control over the manufacturing process guarantees superior quality, on-time delivery, and craftsmanship for your exhibition stand.",
            "provider": { "@type": "Organization", "name": "FANN" },
            "areaServed": { "@type": "City", "name": "Dubai" },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Fabrication Services",
                "itemListElement": [
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CNC Cutting and Routing" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Joinery and Woodworking" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Metalwork and Finishing" } },
                    { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "In-house Graphics Printing" } }
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

const FabricationPage: React.FC = () => {
  return (
    <AnimatedPage>
      <SEO
        title="Exhibition Stand Fabrication Dubai | In-House Production | FANN"
        description="Expert exhibition stand fabrication in Dubai. Our in-house workshop ensures quality control, on-time delivery, and superior craftsmanship. DMCC licensed."
        schema={schema}
      />
      <ServicePageLayout
        heroImage={heroImage}
        heroAltText="A skilled craftsman working on a large wooden structure in a fabrication workshop."
        pageTitle="In-House Exhibition Stand Fabrication in Dubai"
        pageDescription="Where visionary design meets precision engineering. Our complete in-house fabrication capabilities are the cornerstone of our promise of quality."
        breadcrumbs={breadcrumbs}
      >
        <h2>The FANN Fabrication Advantage: In-House vs. Outsourced</h2>
        <p>In the fast-paced world of exhibitions, control is everything. Many exhibition companies in Dubai outsource their <strong>stand production</strong>, creating a dependency on third-party timelines, quality standards, and pricing. FANN takes a different approach. Our significant investment in a state-of-the-art, in-house <strong>exhibition stand fabrication</strong> workshop is our commitment to excellence. This gives us—and you—a critical advantage: direct control over every cut, joint, and finish. It means we're not just designers; we are master builders, ensuring the vision we create on paper is the exact masterpiece we deliver on the show floor.</p>

        <div className="my-8 text-center">
            <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Discuss Your Fabrication Needs</Link>
        </div>

        <h2>Our State-of-the-Art Workshop</h2>
        <p>Our expansive workshop in the UAE is the heart of our operations. It is fully equipped with the latest machinery and staffed by a team of highly skilled carpenters, painters, electricians, and technicians. Our key capabilities include:</p>
        <ul>
            <li><strong>CNC Routing:</strong> For computer-guided, precision cutting of complex shapes and logos, ensuring perfect accuracy every time.</li>
            <li><strong>Custom Joinery & Woodworking:</strong> A dedicated section for crafting bespoke counters, product displays, and structural elements.</li>
            <li><strong>Paint & Finishing Booth:</strong> A controlled environment for applying flawless, high-quality paint finishes, from matte to high-gloss.</li>
            <li><strong>Metal Fabrication:</strong> Capabilities for cutting, welding, and finishing metal components for structural support and decorative accents.</li>
            <li><strong>Graphics Production & Application:</strong> Large-format printing for vibrant fabric graphics and vinyl application for a seamless brand presence.</li>
        </ul>
        <p>This comprehensive setup allows us to handle projects of any scale and complexity, from intricate <Link to="/services/custom-exhibition-stands-dubai">custom stands</Link> to large national pavilions.</p>

        <h2>Quality Control from Start to Finish</h2>
        <p>Our quality control process is rigorous and integrated into every stage of production. It's not just a final check; it's a continuous commitment.</p>
        <ol>
            <li><strong>Technical Review:</strong> Before any material is cut, our production manager reviews the technical drawings with the design team to ensure buildability and structural integrity.</li>
            <li><strong>Material Inspection:</strong> All raw materials are inspected upon delivery to ensure they meet our high standards.</li>
            <li><strong>In-Progress Checks:</strong> Our workshop supervisor conducts daily checks at each stage of manufacturing—from framing to finishing.</li>
            <li><strong>Workshop Pre-Build:</strong> This is a critical step. We assemble the entire stand in our workshop before it is transported to the venue. This allows us to quality check every connection, finish, and graphic, guaranteeing a smooth, efficient on-site installation.</li>
        </ol>

        {/* Visual Placeholder */}
        <div className="my-8 p-4 border-2 border-dashed border-fann-light-gray rounded-lg text-center">
            <p className="text-fann-light-gray font-semibold">[Image: A large exhibition stand fully pre-built inside the FANN workshop]</p>
            <img src="https://via.placeholder.com/800x450.png?text=Stand+Pre-Build+Assembly+in+FANN+Workshop" alt="A large exhibition stand fully assembled inside the FANN workshop for quality control pre-build" className="w-full h-auto mt-2 rounded-md opacity-50"/>
        </div>

        <h2>Advanced Fabrication Techniques</h2>
        <p>We combine traditional craftsmanship with modern technology to push the boundaries of stand design. Our team is skilled in advanced techniques that set our stands apart:</p>
        <ul>
            <li><strong>Multi-Material Integration:</strong> Seamlessly blending wood, metal, acrylic, and fabric to create texturally rich and visually dynamic environments.</li>
            <li><strong>Complex Curves & Structures:</strong> Utilizing CNC technology and expert joinery to create stunning curved walls and complex geometric shapes.</li>
            <li><strong>Integrated Lighting:</strong> Expertly embedding LED lighting into structures for a clean, high-end finish that enhances the overall design.</li>
        </ul>
        <p>Our mastery of these techniques ensures we can execute even the most ambitious designs with precision and flair. See the results in our <Link to="/portfolio">project portfolio</Link>.</p>

        <div className="my-8 text-center">
            <Link to="/contact" className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Get a Fabrication Quote</Link>
        </div>

        <FaqAccordion faqs={faqs} />
      </ServicePageLayout>
    </AnimatedPage>
  );
};

export default FabricationPage;
