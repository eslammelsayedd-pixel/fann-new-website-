import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, FileText, Calendar, Megaphone, Loader2 } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';

const ExhibitionGuidePage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    firstName, 
                    magnetId: 'exhibition-guide-pdf' 
                })
            });
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <AnimatedPage>
            <SEO 
                title="The Ultimate Exhibition Success Guide | Free Download" 
                description="Download the 2025 Ultimate Exhibition Success Guide. 30 pages of checklists, timelines, and strategies for Dubai & Saudi trade shows."
            />
            <div className="min-h-screen bg-fann-charcoal pt-24 text-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Left: Copy */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <span className="text-fann-gold font-bold tracking-widest uppercase text-sm">Free Resource</span>
                            <h1 className="text-5xl md:text-6xl font-serif leading-tight">
                                The Ultimate Exhibition <span className="text-fann-gold italic">Success Guide</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                A comprehensive 30-page playbook for marketing managers and business owners exhibiting in the UAE & KSA. Stop guessing and start converting.
                            </p>
                            
                            <ul className="space-y-4">
                                {[
                                    '6-Month Planning Timeline',
                                    'Pre-Show Marketing Checklist',
                                    'Traffic Generation Tactics',
                                    'ROI Calculation Template',
                                    'Post-Show Follow-up Strategy'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-fann-gold/20 flex items-center justify-center text-fann-gold">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Right: Form & Visual */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-fann-charcoal-light border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-fann-gold/5 rounded-full blur-[80px] pointer-events-none"></div>

                            {status === 'success' ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-3xl font-serif text-white">Check Your Inbox!</h3>
                                    <p className="text-gray-400">We've sent the guide to <strong>{email}</strong>.</p>
                                    <div className="pt-6 border-t border-white/10 mt-6">
                                        <p className="text-sm text-gray-500 mb-4">Ready to put these strategies into action?</p>
                                        <Link to="/book-consultation">
                                            <button className="btn-gold w-full">Book a Free Consultation</button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <FileText className="w-12 h-12 text-fann-gold mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-white">Get Your Free Copy</h3>
                                        <p className="text-sm text-gray-400 mt-2">Join 1,200+ exhibitors who use this guide.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                                            <input 
                                                type="text" 
                                                required 
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold focus:outline-none transition-colors"
                                                placeholder="e.g. Sarah"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Business Email</label>
                                            <input 
                                                type="email" 
                                                required 
                                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-fann-gold focus:outline-none transition-colors"
                                                placeholder="name@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={status === 'submitting'}
                                            className="w-full bg-fann-gold text-black font-bold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            {status === 'submitting' ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                                            Download Guide
                                        </button>
                                        <p className="text-xs text-gray-600 text-center">No spam. Unsubscribe anytime.</p>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ExhibitionGuidePage;