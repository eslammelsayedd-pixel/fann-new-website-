import React, { useState, useEffect, useMemo } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import { regionalEvents } from '../constants';
import { Event } from '../types';

// --- Robust Date Parsing Logic ---

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
    console.error(`Error parsing date string "${dateStr}":`, error);
    const invalidDate = new Date(0);
    return { start: invalidDate, end: invalidDate };
  }
};

const EventsCalendarPage: React.FC = () => {
  const displayableEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return regionalEvents
      .filter(event => parseDateRange(event.date).end >= today)
      .sort((a, b) => parseDateRange(a.date).start.getTime() - parseDateRange(b.date).start.getTime());
  }, []);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(displayableEvents);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('All');

  const industries = useMemo(() => ['All', ...Array.from(new Set(displayableEvents.map(event => event.industry)))].sort(), [displayableEvents]);
  const countries = ['All', 'UAE', 'KSA'];
  const dateRanges = ['All', 'Next 3 Months', 'Next 6 Months', 'This Year'];

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
          return eventStartDate >= today && eventStartDate <= rangeEndDate!;
        });
      }
    }

    setFilteredEvents(events);
  }, [selectedCountry, selectedIndustry, selectedDateRange, displayableEvents]);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-fann-charcoal pt-32 pb-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif font-bold text-fann-gold mb-4">Events Calendar</h1>
                <p className="text-xl text-gray-300">Your guide to the most important exhibitions and trade shows in the UAE & KSA.</p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-black/20 p-4 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    <div className="grid grid-cols-3 gap-2">
                         {countries.map(country => (
                            <button
                                key={country}
                                onClick={() => setSelectedCountry(country)}
                                className={`w-full text-sm py-2 px-1 rounded-md transition-colors ${selectedCountry === country ? 'bg-fann-teal text-white font-bold' : 'bg-fann-charcoal hover:bg-gray-700'}`}
                            >
                                {country}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="industry-filter" className="block text-sm font-medium text-gray-400 mb-2">Industry</label>
                    <select
                        id="industry-filter"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full bg-fann-charcoal border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-fann-gold"
                    >
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                         {dateRanges.map(range => (
                            <button
                                key={range}
                                onClick={() => setSelectedDateRange(range)}
                                className={`w-full text-sm py-2 px-1 rounded-md transition-colors ${selectedDateRange === range ? 'bg-fann-teal text-white font-bold' : 'bg-fann-charcoal hover:bg-gray-700'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event, index) => (
                          <div key={index} className="bg-black/30 p-6 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-fann-teal">
                              <div>
                                  <h3 className="text-2xl font-bold text-white mb-1">{event.name}</h3>
                                  <p className="text-gray-400">{event.venue}, {event.country}</p>
                              </div>
                              <div className="mt-4 sm:mt-0 text-left sm:text-right flex-shrink-0 sm:pl-4">
                                  <p className="text-lg font-semibold text-fann-gold">{event.date}</p>
                                  <p className="text-gray-300">{event.industry}</p>
                              </div>
                          </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-black/20 rounded-lg">
                        <h3 className="text-2xl font-serif text-fann-gold">No Events Found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your filters to find more events.</p>
                      </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </AnimatedPage>
  );
};

export default EventsCalendarPage;