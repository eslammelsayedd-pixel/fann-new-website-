import React from 'react';
import AnimatedPage from '../components/AnimatedPage';

const AboutPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">About FANN</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Founded on the principles of innovation and excellence, FANN is Dubai's leading force in creating spaces and events that tell a story. Our team of international experts brings global standards to local execution.
          </p>
           <div className="mt-12">
            <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="FANN Team in a modern design office" className="rounded-lg shadow-xl" />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default AboutPage;