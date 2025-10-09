import React from 'react';
import AnimatedPage from '../components/AnimatedPage';

const InsightsPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Insights</h1>
          <p className="text-xl text-gray-300">Our blog and industry insights are coming soon. Stay tuned for expert analysis on design trends, event management, and more.</p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default InsightsPage;