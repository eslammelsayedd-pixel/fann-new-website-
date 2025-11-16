import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 mt-16">
       <h2 className="text-4xl font-serif font-bold text-center text-fann-accent-teal dark:text-fann-gold mb-8">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-fann-teal/10 dark:border-fann-border last:border-b-0">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center text-left py-4"
            aria-expanded={activeIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className="text-lg font-semibold text-fann-teal dark:text-fann-peach">{faq.question}</h3>
            <ChevronDown
              className={`transform transition-transform duration-300 text-fann-accent-teal dark:text-fann-gold ${activeIndex === index ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                id={`faq-answer-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-4 text-fann-teal/80 dark:text-fann-light-gray leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
