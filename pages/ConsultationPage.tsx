import React from 'react';
import AnimatedPage from '../components/AnimatedPage';
import SEO from '../components/SEO';
import { Calendar, Clock, Video, Award } from 'lucide-react';

const ConsultationPage: React.FC = () => {
    return (
        <AnimatedPage>
            <SEO title="Book Free Design Consultation | FANN" description="Schedule a 30-minute session with our expert exhibition designers." />
            <div className="min-h-screen bg-fann-charcoal text-white pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12">
                        
                        {/* Left: Pitch */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-fann-gold">
                                    Let's Discuss Your Vision
                                </h1>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    Planning an exhibition or event? Book a complimentary 30-minute strategy session with a senior FANN designer. No obligation, just expert advice.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: Clock, title: "30 Minutes", desc: "Focused strategy session." },
                                    { icon: Video, title: "Zoom / Teams", desc: "Convenient online meeting." },
                                    { icon: Award, title: "Senior Expert", desc: "Speak directly with a lead designer." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-fann-gold/30 transition-colors">
                                        <item.icon className="w-6 h-6 text-fann-gold mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-gray-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-l-4 border-fann-gold bg-fann-charcoal-light border-y border-r border-white/5">
                                <p className="italic text-sm text-gray-300">
                                    "The consultation gave us more clarity in 30 minutes than we had in weeks of internal meetings."
                                </p>
                                <p className="mt-2 font-bold text-xs uppercase tracking-wider text-fann-gold">- Marketing Director, FinTech Hive</p>
                            </div>
                        </div>

                        {/* Right: Calendly Embed */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-lg shadow-2xl overflow-hidden h-[700px] border border-gray-200">
                                {/* Placeholder for Calendly - In production, replace URL */}
                                <iframe 
                                    src="https://calendly.com/fann-exhibitions/consultation" 
                                    width="100%" 
                                    height="100%" 
                                    frameBorder="0" 
                                    title="Select a Date & Time - Calendly"
                                ></iframe>
                                {/* Fallback if Calendly URL is not real */}
                                <div className="hidden">
                                    <p className="p-8 text-center text-gray-500">
                                        Note to developer: Replace the iframe `src` with your actual Calendly booking link.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ConsultationPage;