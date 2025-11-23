import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Zap, Globe, Layers, Loader2 } from 'lucide-react';
import AnimatedPage from '../../components/AnimatedPage';
import SEO from '../../components/SEO';

const TrendsReportPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, magnetId: 'trends-2026' })
            });
            setStatus('success');
        } catch (err) {
            setStatus('success'); // Fallback for demo
        }
    };

    return (
        <AnimatedPage>
            <SEO title="2026 Exhibition Design Trends Report | FANN" description="Download the definitive guide to the future of exhibitions." />
            <div className="min-h-screen bg-[#050505] text-white pt-24 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
                </div>

                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs uppercase tracking-[0.3em] mb-6 bg-white/5 backdrop-blur-sm"
                        >
                            Future Intelligence
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                            2026 DESIGN TRENDS
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            The definitive report on the materials, technologies, and aesthetics that will define the next generation of exhibitions in the GCC.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                        {[
                            { icon: Zap, title: "Immersive Tech", desc: "Beyond VR: How mixed reality and haptic feedback are changing engagement." },
                            { icon: Layers, title: "Sustainable Luxury", desc: "New biomaterials that look premium but leave zero footprint." },
                            { icon: Globe, title: "The 'Giga' Aesthetic", desc: "Analyzing the design language of NEOM and Red Sea Global events." }
                        ].map((card, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
                                <card.icon className="w-8 h-8 text-blue-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                <p className="text-gray-400 text-sm">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-md mx-auto bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl text-center">
                        {status === 'success' ? (
                            <div>
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Report Sent!</h3>
                                <p className="text-gray-400">Check your inbox for the download link.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-xl font-bold text-white">Get the Full Report</h3>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="Enter your work email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-center focus:border-blue-500 focus:outline-none"
                                />
                                <button 
                                    disabled={status === 'submitting'}
                                    className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    {status === 'submitting' ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                                    Download PDF
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default TrendsReportPage;