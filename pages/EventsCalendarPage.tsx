
import React, { useState, useEffect, useMemo } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { Event } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DateRange {
  start: Date;
  end: Date;
}

const parseDateRange = (dateStr: string): DateRange => {
  try {
    const cleanStr = dateStr.replace(/\(TBC\)/i, '').trim();
    const yearMatch = cleanStr.match(/\b(\d{4})\b/);
    if (!yearMatch) throw new Error("Year not found");
    const year = yearMatch[1];
    const datePart = cleanStr.replace(`, ${year}`, '').trim();
    const parts = datePart.split('-').map(p => p.trim());
    const startPart = parts[0];

    if (parts.length === 1) {
      const date = new Date(`${startPart} ${year}`);
      if (isNaN(date.getTime())) throw new Error(`Invalid single date: "${startPart} ${year}"`);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      return { start: date, end: endDate };
    }

    const endPart = parts[1];
    const startMonthMatch = startPart.match(/([A-Za-z]{3,})/);
    if (!startMonthMatch) throw new Error(`Could not find month in start part: "${startPart}"`);
    const startMonth = startMonthMatch[1];
    const endMonth = endPart.match(/([A-Za-z]{3,})/) ? endPart.match(/([A-Za-z]{3,})/)![0] : startMonth;
    const startDate = new Date(`${startPart}, ${year}`);
    const endDay = endPart.replace(/[A-Za-z]{3,}\s?/, '');
    const endDate = new Date(`${endMonth} ${endDay}, ${year}`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Could not construct valid date from parts");
    }
    
    endDate.setHours(23, 59, 59, 999);
    return { start: startDate, end: endDate };

  } catch (error) {
    // console.error(`Error parsing date string "${dateStr}":`, error);
    const invalidDate = new Date(0);
    return { start: invalidDate, end: invalidDate };
  }
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            variants={itemVariants}
            className="bg-fann-charcoal-light border border-white/5 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-start border-l-4 border-l-fann-gold hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex-grow pr-4">
                <div className="flex justify-between items-start w-full sm:hidden mb-2">
                     <p className="text-lg font-semibold text-fann-gold">{event.date}</p>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{event.name}</h3>
                <p className="text-gray-400">{event.venue}, {event.country}</p>
                <p className="text-sm text-gray-500 mt-1">{event.industry}</p>
                
                <AnimatePresence>
                    {isExpanded && event.description && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden text-sm text-gray-300 leading-relaxed"
                        >
                            {event.description}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right flex-shrink-0 flex flex-col items-end justify-between h-full gap-4">
                <div className="hidden sm:block">
                    <p className="text-lg font-semibold text-fann-gold">{event.date}</p>
                </div>
                {event.description && (
                    <button className="text-fann-gold/70 hover:text-fann-gold transition-colors">
                        {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

const EventsCalendarPage: React.FC = () => {
  const displayableEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return regionalEvents
      .map(event => ({ event, parsedDate: parseDateRange(event.date) }))
      .filter(({ parsedDate }) => parsedDate.end >= today || parsedDate.start.getTime() === 0) // Keep TBC events
      .sort((a, b) => {
          if (a.parsedDate.start.getTime() === 0) return 1; // Push TBC to end
          if (b.parsedDate.start.getTime() === 0) return -1;
          return a.parsedDate.start.getTime() - b.parsedDate.start.getTime();
      })
      .map(({ event }) => event);
  }, []);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(displayableEvents);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('All');

  const industries = useMemo(() => ['All', ...Array.from(new Set(displayableEvents.map(event => event.industry)))].sort(), [displayableEvents]);
  const countries = ['All', 'UAE', 'KSA'];
  const dateRanges = ['All', 'Next 3 Months', 'Next 6 Months', 'This Year'];
  
  const calendarPageSchema = useMemo(() => {
    const validEvents = displayableEvents.filter(e => parseDateRange(e.date).start.getTime() !== 0);
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "UAE & KSA Events Calendar | FANN",
        "description": "Your complete guide to upcoming exhibitions and trade shows in Dubai, Abu Dhabi, and Saudi Arabia. Filter by industry, country, and date to plan your next event with FANN.",
        "url": "https://fann.ae/events-calendar",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": validEvents.length,
            "itemListElement": validEvents.map((event, index) => {
                const { start, end } = parseDateRange(event.date);
                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Event",
                        "name": event.name,
                        "startDate": start.getTime() !== 0 ? start.toISOString().split('T')[0] : undefined,
                        "endDate": end.getTime() !== 0 ? end.toISOString().split('T')[0] : undefined,
                        "location": {
                            "@type": "Place",
                            "name": event.venue,
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": event.country
                            }
                        },
                        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                        "description": event.description || `A leading ${event.industry} event held at ${event.venue}.`
                    }
                };
            })
        }
    };
  }, [displayableEvents]);

  useEffect(() => {
    let events = [...displayableEvents];

    if (selectedCountry !== 'All') {
      events = events.filter(event => event.country === selectedCountry);
    }

    if (selectedIndustry !== 'All') {
      events = events.filter(event => event.industry === selectedIndustry);
    }

    if (selectedDateRange !== 'All') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let rangeEndDate: Date | null = null;

      if (selectedDateRange === 'Next 3 Months') {
        rangeEndDate = new Date(today);
        rangeEndDate.setMonth(today.getMonth() + 3);
      } else if (selectedDateRange === 'Next 6 Months') {
        rangeEndDate = new Date(today);
        rangeEndDate.setMonth(today.getMonth() + 6);
      } else if (selectedDateRange === 'This Year') {
        rangeEndDate = new Date(today.getFullYear(), 11, 31);
      }

      if (rangeEndDate) {
        events = events.filter(event => {
          const eventStartDate = parseDateRange(event.date).start;
          // Include TBC events if range is 'All' or keep them out for specific ranges?
          // Usually specific ranges filter out TBCs as they have date 0
          if (eventStartDate.getTime() === 0) return false;
          return eventStartDate >= today && eventStartDate <= rangeEndDate!;
        });
      }
    }

    setFilteredEvents(events);
  }, [selectedCountry, selectedIndustry, selectedDateRange, displayableEvents]);

  return (
    <AnimatedPage>
        <SEO 
            title="UAE & KSA Events Calendar | FANN"
            description="Your complete guide to upcoming exhibitions and trade shows in Dubai, Abu Dhabi, and Saudi Arabia. Filter by industry, country, and date to plan your next event with FANN."
            schema={calendarPageSchema}
        />
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Events Calendar</h1>
                <p className="text-xl text-gray-400">Your guide to the most important exhibitions and trade shows in the UAE & KSA.</p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-fann-charcoal-light border border-white/10 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
                <div>
                    <label className="block text-sm font-normal text-gray-400 mb-2">Country</label>
                    <div className="grid grid-cols-3 gap-2">
                         {countries.map(country => (
                            <button
                                key={country}
                                onClick={() => setSelectedCountry(country)}
                                className={`w-full text-sm font-semibold py-2 px-1 rounded-md transition-colors ${selectedCountry === country ? 'bg-fann-gold text-fann-charcoal' : 'bg-black/30 text-gray-300 hover:bg-white/5'}`}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="industry-filter" className="block text-sm font-normal text-gray-400 mb-2">Industry</label>
                    <select
                        id="industry-filter"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold text-white"
                    >
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-normal text-gray-400 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                         {dateRanges.map(range => (
                            <button
                                key={range}
                                onClick={() => setSelectedDateRange(range)}
                                className={`w-full text-sm font-semibold py-2 px-1 rounded-md transition-colors ${selectedDateRange === range ? 'bg-fann-gold text-fann-charcoal' : 'bg-black/30 text-gray-300 hover:bg-white/5'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event, idx) => (
                          <EventCard key={`${event.name}-${idx}`} event={event} />
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-fann-charcoal-light rounded-lg border border-white/10"
                      >
                        <h3 className="text-2xl font-serif text-fann-gold">No Events Found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your filters to find more events.</p>
                      </motion.div>
                    )}
                </motion.div>
            </div>

        </div>
      </div>
    </AnimatedPage>
  );
};

export default EventsCalendarPage;