import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { testimonials } from '../constants';

interface Breadcrumb {
  name: string;
  path: string;
}

interface ServicePageLayoutProps {
  heroImage: string;
  heroAltText: string;
  pageTitle: string;
  pageDescription: string;
  breadcrumbs: Breadcrumb[];
  children: React.ReactNode;
}

const buttonTransition = { type: 'spring', stiffness: 400, damping: 17 } as const;

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  heroImage,
  heroAltText,
  pageTitle,
  pageDescription,
  breadcrumbs,
  children,
}) => {
  return (
    <div className="bg-fann-peach dark:bg-fann-teal text-fann-teal dark:text-fann-peach">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center text-fann-peach overflow-hidden bg-fann-teal">
        <picture>
          <source srcSet={`${heroImage}&fm=webp`} type="image/webp" />
          <source srcSet={heroImage} type="image/jpeg" />
          <img
            src={heroImage}
            alt={heroAltText}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            loading="eager"
            width="1260"
            height="750"
          />
        </picture>
        <div className="relative z-10 p-4 w-full container mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight text-fann-gold drop-shadow-md">
            {pageTitle}
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-fann-peach/90 drop-shadow">
            {pageDescription}
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="bg-white dark:bg-fann-accent-teal py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight size={16} className="text-fann-light-gray mx-2" />}
                <Link
                  to={crumb.path}
                  className={`hover:text-fann-gold dark:hover:text-fann-gold transition-colors ${
                    index === breadcrumbs.length - 1 ? 'font-bold text-fann-accent-teal dark:text-fann-gold' : 'text-fann-light-gray'
                  }`}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto prose-h2:font-serif prose-h2:text-4xl prose-h2:text-fann-accent-teal dark:prose-h2:text-fann-gold prose-h2:mb-4 prose-h2:mt-12 first:prose-h2:mt-0 prose-a:text-fann-accent-teal dark:prose-a:text-fann-gold hover:prose-a:underline prose-strong:text-fann-teal dark:prose-strong:text-fann-peach">
                 {children}
            </div>
        </div>
      </main>

       {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-fann-accent-teal text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto container px-4 sm:px-6 lg:px-8 mt-12">
            {testimonials.map((testimonial) => (
                <div key={testimonial.client} className="bg-fann-peach dark:bg-fann-teal p-8 rounded-lg text-left shadow-lg">
                    <p className="italic text-fann-teal dark:text-fann-peach mb-6">"{testimonial.quote}"</p>
                    <p className="font-bold text-fann-accent-teal dark:text-fann-gold">{testimonial.client}</p>
                    <p className="text-sm text-fann-light-gray">{testimonial.company} ({testimonial.projectType})</p>
                </div>
            ))}
        </div>
    </section>

      {/* Final CTA */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center bg-gradient-to-r from-fann-accent-teal to-fann-gold p-1 rounded-lg">
                 <div className="bg-white dark:bg-fann-accent-teal rounded-lg py-16 px-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-fann-teal dark:text-fann-peach">Ready to Start Your Project?</h2>
                    <p className="max-w-2xl mx-auto text-fann-teal/90 dark:text-fann-peach/90 mb-8">Let's discuss how our expertise can elevate your brand. Contact us for a complimentary consultation and a detailed quote.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/contact">
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={buttonTransition}
                                className="bg-fann-gold text-fann-charcoal font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                            >
                                Get a Free Quote
                            </motion.button>
                        </Link>
                         <Link to="/portfolio">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                className="border-2 border-fann-accent-teal dark:border-fann-gold text-fann-accent-teal dark:text-fann-gold font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider w-full sm:w-auto"
                            >
                                View Our Portfolio
                            </motion.button>
                        </Link>
                    </div>
                 </div>
            </div>
        </section>
    </div>
  );
};

export default ServicePageLayout;
