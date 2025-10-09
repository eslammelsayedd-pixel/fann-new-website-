import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import { PenTool, ArrowLeft } from 'lucide-react';

const InteriorStudioPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <PenTool className="mx-auto h-20 w-20 text-fann-teal mb-6" />
            <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Interior Design Studio</h1>
            <p className="text-2xl text-gray-300 font-semibold">Coming Soon</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4">
                The future of interior design is on its way. Our AI Interior Design Studio will empower you to craft stunning concepts for commercial and residential spaces in minutes. Stay tuned.
            </p>
            <div className="mt-12">
                 <Link to="/ai-design-studio">
                    <button className="flex items-center gap-2 text-fann-gold mx-auto font-bold py-3 px-6 rounded-full border-2 border-fann-gold hover:bg-fann-gold hover:text-fann-charcoal transition-colors">
                        <ArrowLeft size={20} />
                        Back to AI Design Studio
                    </button>
                </Link>
            </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default InteriorStudioPage;