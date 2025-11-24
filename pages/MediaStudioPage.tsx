import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const MediaStudioPage: React.FC = () => {
    return (
        <AnimatedPage>
             <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Clapperboard className="mx-auto h-20 w-20 text-fann-gold" />
                    <h1 className="text-5xl font-serif font-bold text-fann-gold mt-6 mb-4">Media Studio</h1>
                    <h2 className="text-3xl font-serif text-white mb-4">Coming Soon</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Our smart Media Studio is currently under development. Soon, you'll be able to generate video concepts and perform intelligent edits on your images.
                    </p>
                    <Link to="/fann-studio" className="btn-outline inline-block">
                        Back to FANN Studio
                    </Link>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default MediaStudioPage;