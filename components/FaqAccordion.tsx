import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem { question: string; answer: string; }
interface FaqAccordionProps { faqs: FaqItem[]; heading?: string; }

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs, heading }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const prefix = useId();
  return (
    <div className="space-y-4 mt-16">
      <h2 className="text-4xl font-serif font-bold text-center text-fann-accent-teal dark:text-fann-gold mb-8">{heading || 'Frequently Asked Questions'}</h2>
      {faqs.map((faq, index) => {
        const open = activeIndex === index;
        const buttonId = `${prefix}-faq-button-${index}`;
        const answerId = `${prefix}-faq-answer-${index}`;
        return (
          <div key={faq.question} className="border-b border-fann-teal/10 dark:border-fann-border last:border-b-0">
            <h3 className="!my-0">
              <button id={buttonId} type="button" onClick={() => setActiveIndex(open ? null : index)} aria-expanded={open} aria-controls={answerId} className="w-full min-h-[48px] flex justify-between gap-4 items-center text-left py-4 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-fann-gold">
                <span className="text-lg font-semibold text-fann-teal dark:text-fann-peach">{faq.question}</span>
                <ChevronDown aria-hidden="true" className={`shrink-0 text-fann-accent-teal dark:text-fann-gold ${open ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <div id={answerId} role="region" aria-labelledby={buttonId} hidden={!open}>
              <div className="pb-4 text-fann-teal/80 dark:text-fann-light-gray leading-relaxed">{faq.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default FaqAccordion;
