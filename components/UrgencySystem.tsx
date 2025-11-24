
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, Zap, Calendar, ArrowRight, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { regionalEvents } from '../constants';

// --- Utilities ---

const getNextMajorEvent = () => {
    const majorKeywords = ["GITEX", "ADIPEC", "Arab Health", "Big 5", "Gulfood", "Cityscape"];
    const today = new Date();
    
    // Helper to parse date strings like "Nov 03-06, 2025" or "Nov 2025 (TBC)"
    const parseEventDate = (dateStr: string) => {
        try {
            const cleanStr = dateStr.replace(/\(TBC\)/i, '').trim();
            const yearMatch = cleanStr.match(/\b(\d{4})\b/);
            if (!yearMatch) return null;
            const year = parseInt(yearMatch[1]);
            
            // Extract Month
            const monthMatch = cleanStr.match(/([A-Za-z]{3,})/);
            if (!monthMatch) return null;
            const monthStr = monthMatch[1];
            const month = new Date(`${monthStr} 1, 2000`).getMonth();
            
            // Extract Day (default to 1st if not found)
            const dayMatch = cleanStr.match(/\d+/);
            const day = dayMatch ? parseInt(dayMatch[0]) : 1; // Note: year is also \d+, so this logic is simplified
            
            // Re-parse strictly
            const parts = cleanStr.split(/[ ,-]+/);
            let dayVal = 1;
            for(const p of parts) {
                if(!isNaN(parseInt(p)) && parseInt(p) < 32) {
                    dayVal = parseInt(p);
                    break;
                }
            }

            const d = new Date(year, month, dayVal);
            return d;
        } catch (e) {
            return null;
        }
    };

    const upcoming = regionalEvents
        .map(e => ({ ...e, parsedDate: parseEventDate(e.date) }))
        .filter(e => e.parsedDate && e.parsedDate > today)
        .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime());

    // Prioritize Major events, else take the nearest one
    const nextMajor = upcoming.find(e => majorKeywords.some(k => e.name.includes(k))) || upcoming[0];
    return nextMajor;
};

// --- Components ---

export const UrgencyBar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const nextEvent = useMemo(() => getNextMajorEvent(), []);
    const [timeLeft, setTimeLeft] = useState<{days: number, hours: number}>({ days: 0, hours: 0 });

    useEffect(() => {
        if (!nextEvent?.parsedDate) return;
        
        const timer = setInterval(() => {
            const now = new Date();
            const diff = nextEvent.parsedDate!.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            });
        }, 1000 * 60); // Update every minute

        return () => clearInterval(timer);
    }, [nextEvent]);

    if (!isVisible || !nextEvent) return null;

    return (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-fann-gold/90 to-[#bfa172]/90 text-black text-sm font-bold relative z-[60]"
        >
            <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-fann-gold px-2 py-1 rounded text-xs uppercase tracking-widest animate-pulse">
                        Next Major Event
                    </div>
                    <span className="uppercase tracking-wide">{nextEvent.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 font-mono">
                        <Clock size={16} />
                        <span>{timeLeft.days}d {timeLeft.hours}h Left to Prepare</span>
                    </div>
                    <span className="hidden md:inline text-black/50">|</span>
                    <div className="flex items-center gap-2 text-xs">
                        <AlertTriangle size={14} />
                        <span>Limited production slots available</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export const DeadlineCalculator: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState('');
    const [standType, setStandType] = useState('Custom (>30sqm)');
    const [result, setResult] = useState<{daysLeft: number, status: string, urgent: boolean} | null>(null);

    const upcomingEvents = useMemo(() => {
        return regionalEvents
            .filter(e => !e.date.includes("TBC"))
            .slice(0, 10); // First 10 confirmed
    }, []);

    const calculateDeadline = () => {
        if (!selectedEvent) return;
        
        const event = upcomingEvents.find(e => e.name === selectedEvent);
        // Parse roughly
        const dateStr = event?.date.split(',')[0] + ', ' + event?.date.match(/\d{4}/)?.[0];
        const eventDate = new Date(dateStr);
        const today = new Date();
        
        // Logic: Custom needs 60 days, Modular needs 30
        const requiredDays = standType.includes('Custom') ? 60 : 30;
        const daysUntilEvent = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const daysLeftToOrder = daysUntilEvent - requiredDays;

        let status = '';
        let urgent = false;

        if (daysLeftToOrder < 0) {
            status = `CRITICAL: You are ${Math.abs(daysLeftToOrder)} days past the recommended start date. Rush fees may apply.`;
            urgent = true;
        } else if (daysLeftToOrder < 14) {
            status = `URGENT: Only ${daysLeftToOrder} days left to finalize design before rush charges kick in.`;
            urgent = true;
        } else {
            status = `On Track: You have ${daysLeftToOrder} days to finalize your concept comfortably.`;
            urgent = false;
        }

        setResult({ daysLeft: daysUntilEvent, status, urgent });
    };

    return (
        <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl max-w-4xl mx-auto my-16">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 flex items-center gap-2">
                        <Calendar className="text-fann-gold" /> Deadline Calculator
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Enter your event details to see if you qualify for standard pricing or require Fast-Track service.
                    </p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Exhibition</label>
                            <select 
                                className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-fann-gold outline-none"
                                value={selectedEvent}
                                onChange={e => setSelectedEvent(e.target.value)}
                            >
                                <option value="">-- Choose Event --</option>
                                {upcomingEvents.map(e => (
                                    <option key={e.name} value={e.name}>{e.name} ({e.date})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stand Type</label>
                            <div className="flex gap-2">
                                {['Custom (>30sqm)', 'Modular / Shell Upgrade'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setStandType(type)}
                                        className={`flex-1 py-2 text-xs border rounded transition-colors ${standType === type ? 'border-fann-gold bg-fann-gold/10 text-white' : 'border-white/20 text-gray-500'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={calculateDeadline} className="w-full btn-gold">Check Availability</button>
                    </div>
                </div>

                <div className="md:w-1/2 bg-fann-charcoal-light rounded-lg p-6 flex flex-col justify-center items-center text-center border border-white/5 relative overflow-hidden">
                    {!result ? (
                        <div className="text-gray-500">
                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Select an event to see your timeline.</p>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            {result.urgent ? (
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-red-900/30 text-red-400 px-4 py-1 rounded-full border border-red-500/50 text-xs font-bold uppercase tracking-wider animate-pulse">
                                        <Zap size={14} /> Fast Track Required
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{result.status}</h4>
                                    <p className="text-sm text-gray-400">Our emergency fabrication team can still deliver, but slots are limited.</p>
                                    <Link to="/contact" className="inline-block mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest text-xs transition-all">
                                        Request Urgent Quote
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-1 rounded-full border border-green-500/50 text-xs font-bold uppercase tracking-wider">
                                        <CheckCircle size={14} /> Standard Pricing Available
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{result.status}</h4>
                                    <p className="text-sm text-gray-400">Book now to secure your design team and workshop slot.</p>
                                    <Link to="/fann-studio" className="inline-block mt-4 border border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-sm uppercase tracking-widest text-xs transition-all">
                                        Start Designing
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AvailabilityBadge: React.FC = () => {
    const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
    const year = new Date().getFullYear();
    
    // Mock availability logic - reduce count based on day of month to simulate activity
    const day = new Date().getDate();
    const slotsLeft = Math.max(2, 12 - Math.floor(day / 3)); 

    return (
        <div className="bg-fann-charcoal-light border border-fann-gold/30 p-4 rounded-lg flex items-start gap-3 mb-6">
            <div className="bg-fann-gold/10 p-2 rounded-full text-fann-gold">
                <Clock size={20} />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Q{currentQuarter} {year} Availability</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                    We are currently experiencing high demand. Only <strong className="text-fann-gold">{slotsLeft} full-fabrication slots</strong> remain for events this quarter.
                </p>
                <div className="w-full bg-black/50 h-1.5 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${( (15 - slotsLeft) / 15 ) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-fann-gold to-red-500"
                    />
                </div>
            </div>
        </div>
    );
};
