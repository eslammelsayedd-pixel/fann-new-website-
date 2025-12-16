import React from 'react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import ServicePageLayout from '../../components/ServicePageLayout';
import FaqAccordion from '../../components/FaqAccordion';
import { Link } from 'react-router-dom';

const pageTitle = "Exhibition Stand Cost in Dubai & UAE: The Ultimate 2025 Guide";
const heroImage = "https://images.pexels.com/photos/30556812/pexels-photo-30556812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // Reusing a generic image for now

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Resources', path: '/resources' },
  { name: 'Cost Guide', path: '/resources/exhibition-stand-cost-dubai' }
];

const faqs = [
    { question: "What is the average cost of a custom exhibition stand in Dubai?", answer: "The average cost for a custom-built stand in Dubai ranges from AED 1,500 to AED 3,500 per square meter, depending on the complexity, materials, and technology used. A typical 36 sqm stand might cost between AED 54,000 and AED 126,000." },
    { question: "How much does a modular stand cost in the UAE?", answer: "Modular stands are significantly more cost-effective. While the initial purchase cost can be similar to a custom build, the reusability means the cost per show drops dramatically. Rental options are also available, starting from around AED 800 per square meter." },
    { question: "What factors most influence the final price of an exhibition stand?", answer: "The three main factors are: 1) **Size and Height:** Larger, double-decker stands require more material and labor. 2) **Materials:** Custom joinery, metalwork, and high-end finishes are more expensive than standard shell scheme materials. 3) **Technology:** Integrating large LED screens, interactive displays, and custom lighting significantly increases the budget." },
    { question: "Does the cost include venue fees and utilities?", answer: "No. Our quote covers design, fabrication, logistics, installation, and dismantling. Venue-specific costs like space rental, electricity connection, water, and internet are separate and must be paid directly to the organizer or venue (e.g., DWTC or ADNEC)." },
    { question: "Is it cheaper to rent or buy an exhibition stand in Dubai?", answer: "If you exhibit once a year, renting is usually cheaper. If you exhibit three or more times a year, buying a reusable modular system offers the best long-term return on investment (ROI)." },
    { question: "What is a shell scheme stand and how much does it cost?", answer: "A shell scheme is a basic, pre-built booth provided by the event organizer. It is the cheapest option, typically costing between AED 500 to AED 1,000 per square meter, but offers minimal branding and customization." }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
};

const CostGuidePage: React.FC = () => {
  return (
    <AnimatedPage>
      <SEO
        title={pageTitle}
        description="Detailed guide to exhibition stand costs in Dubai and the UAE for 2025. Get a transparent breakdown of custom, modular, and shell scheme prices per square meter."
        schema={schema}
      />
      <ServicePageLayout
        heroImage={heroImage}
        heroAltText="Exhibition stand budget planning with a calculator and financial documents."
        pageTitle={pageTitle}
        pageDescription="Navigate the complexities of exhibition budgeting with our transparent breakdown of costs for custom and modular stands in the GCC."
        breadcrumbs={breadcrumbs}
      >
        <p className="text-lg font-serif text-fann-gold mb-8">
            The cost of an exhibition stand in Dubai is the single most important factor for most exhibitors. Our guide provides a clear, honest breakdown of what you can expect to pay in 2025 for a high-impact presence at events like GITEX, Arab Health, and Gulfood.
        </p>

        <h2>Exhibition Stand Cost Breakdown (Per Square Meter)</h2>
        <p>The price of your stand is primarily determined by the type of build you choose. Here is a general range for the Dubai market:</p>
        
        <div className="overflow-x-auto my-8">
            <table className="min-w-full divide-y divide-white/10">
                <thead>
                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                        <th className="px-6 py-3">Stand Type</th>
                        <th className="px-6 py-3">Cost Range (AED/sqm)</th>
                        <th className="px-6 py-3">Best For</th>
                        <th className="px-6 py-3">FANN Service</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">Shell Scheme</td>
                        <td className="px-6 py-4 whitespace-nowrap">AED 500 - AED 1,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">First-time exhibitors, small budgets</td>
                        <td className="px-6 py-4 whitespace-nowrap">Basic Graphics & Furniture</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">Modular System</td>
                        <td className="px-6 py-4 whitespace-nowrap">AED 800 - AED 2,000</td>
                        <td className="px-6 py-4 whitespace-nowrap">Multi-show exhibitors, reusability</td>
                        <td className="px-6 py-4 whitespace-nowrap"><Link to="/services/modular-exhibition-systems-dubai">Modular Systems</Link></td>
                    </tr>
                    <tr className="hover:bg-white/5 bg-fann-gold/10">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-fann-gold">Custom Build</td>
                        <td className="px-6 py-4 whitespace-nowrap text-fann-gold">AED 1,500 - AED 3,500+</td>
                        <td className="px-6 py-4 whitespace-nowrap text-fann-gold">Maximum brand impact, large spaces</td>
                        <td className="px-6 py-4 whitespace-nowrap"><Link to="/services/custom-exhibition-stands-dubai">Custom Stands</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>Factors That Influence Your Final Budget</h2>
        <p>While the per-square-meter rate provides a starting point, several key factors will adjust your final quote:</p>
        
        <h3>1. Size and Structure Complexity</h3>
        <ul>
            <li><strong>Double-Decker Stands:</strong> These instantly double your floor space but require significant structural engineering, safety approvals, and specialized materials, increasing the cost by 50-100% over a single-level stand.</li>
            <li><strong>Stand Location:</strong> Island stands (open on all four sides) are more expensive to build than corner or inline stands due to the need for a finished look on all sides.</li>
        </ul>

        <h3>2. Materials and Finishes</h3>
        <ul>
            <li><strong>Standard vs. Premium:</strong> Using standard MDF and vinyl graphics is cost-effective. Opting for bespoke joinery, solid wood, glass, polished metal, or specialized flooring (e.g., raised, illuminated) will push the cost toward the higher end of the range.</li>
            <li><strong>Reusability:</strong> Investing in a high-quality modular system or custom components designed for storage and reuse (a FANN specialty) increases the initial cost but dramatically lowers the cost-per-show over a 3-5 year period.</li>
        </ul>

        <h3>3. Technology and Interactive Elements</h3>
        <ul>
            <li><strong>AV Integration:</strong> Large-format LED walls, seamless video screens, and interactive touch tables are major cost drivers.</li>
            <li><strong>Custom Lighting:</strong> Programmable LED lighting, specialized spotlights, and architectural lighting features add to the budget but are essential for creating a high-end look.</li>
            <li><strong>Interactive Experiences:</strong> VR/AR setups, motion sensors, and custom software development for interactive product demos require specialized technical support.</li>
        </ul>

        <div className="my-8 text-center">
            <Link to="/contact" className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider inline-block">Request a Detailed Cost Estimate</Link>
        </div>

        <h2>Frequently Asked Questions (FAQs) on Stand Costs</h2>
        <p>We've compiled the most common questions our clients ask about budgeting for their exhibition presence in Dubai.</p>
        <FaqAccordion faqs={faqs} />

        <p className="mt-8 text-center text-gray-400 text-sm">
            Ready to start planning your budget? <Link to="/contact" className="text-fann-gold hover:underline">Contact FANN today</Link> for a no-obligation consultation and a transparent, detailed quote tailored to your next event.
        </p>
      </ServicePageLayout>
    </AnimatedPage>
  );
};

export default CostGuidePage;
