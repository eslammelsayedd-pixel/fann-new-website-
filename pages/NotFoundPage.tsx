import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => (
  <>
    <SEO title="Page not found" description="The page you are looking for does not exist. Explore FANN's exhibition, events and fit-out services." noindex />
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="max-w-xl">
        <p className="text-fann-gold tracking-widest text-sm mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">This page doesn't exist</h1>
        <p className="text-gray-400 mb-10">The link may be old or mistyped. Here are the best places to start:</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-fann-gold text-black font-semibold rounded-sm">Home</Link>
          <Link to="/services" className="px-6 py-3 border border-white/20 text-white rounded-sm">Services</Link>
          <Link to="/portfolio" className="px-6 py-3 border border-white/20 text-white rounded-sm">Portfolio</Link>
          <Link to="/contact" className="px-6 py-3 border border-white/20 text-white rounded-sm">Contact</Link>
        </div>
      </div>
    </section>
  </>
);

export default NotFoundPage;
