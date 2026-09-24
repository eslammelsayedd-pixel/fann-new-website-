import React from 'react';
import SEO from '../components/SEO';

const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-serif text-white mt-10 mb-4">{children}</h2>
);

const PrivacyPage: React.FC = () => (
  <>
    <SEO title="Privacy Policy" description="How FANN collects, uses and protects the information you share through fann.ae." />
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 max-w-3xl text-gray-300 leading-relaxed">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>
      <p>This policy explains what information FANN collects when you use fann.ae, why we collect it and how you can contact us about it.</p>

      <H>What we collect</H>
      <ul className="list-disc pl-6 space-y-2">
        <li>Details you send through our forms: name, email, phone, company, project details and any files or briefs you share.</li>
        <li>Messages you send to our website chat assistant.</li>
        <li>Basic usage data collected by analytics and advertising tools (Google Tag Manager, Google Analytics and Meta Pixel), such as pages visited, device type and approximate location.</li>
      </ul>

      <H>How we use it</H>
      <ul className="list-disc pl-6 space-y-2">
        <li>To reply to your enquiry, prepare quotes and deliver your project.</li>
        <li>To understand which pages and campaigns work, so we can improve the website and our marketing.</li>
        <li>We do not sell your personal information.</li>
      </ul>

      <H>Cookies</H>
      <p>Analytics and advertising tools set cookies in your browser. You can block or delete cookies in your browser settings; the site will still work.</p>

      <H>Who we share it with</H>
      <p>Only with service providers that help us run the website and handle enquiries (hosting, email delivery, analytics and advertising platforms), and where the law requires it.</p>

      <H>How long we keep it</H>
      <p>We keep enquiry details for as long as needed to handle your request and any project that follows, and to meet legal and accounting duties.</p>

      <H>Your choices</H>
      <p>You can ask us to see, correct or delete the personal information we hold about you by emailing <a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a>.</p>

      <H>Contact</H>
      <p>FANN, Office No. 508, Dusseldorf Business Center, Al Barsha, Dubai, UAE. Email: <a href="mailto:sales@fann.ae" className="text-fann-gold">sales@fann.ae</a>. Phone: <a href="tel:+971505667502" className="text-fann-gold">+971 50 566 7502</a>.</p>
    </section>
  </>
);

export default PrivacyPage;
