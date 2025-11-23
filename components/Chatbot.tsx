import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User, BookOpen } from 'lucide-react';

interface Message {
    role: 'user' | 'model';
    parts: { text: string }[];
    sources?: { uri: string, title: string }[];
}

// Simple markdown parser
const parseMarkdown = (text: string) => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(\n\s*-\s)/g, '</li><li>')
        .replace(/<li>/, '<ul><li>')

    if ((html.match(/<ul>/g) || []).length > (html.match(/<\/ul>/g) || []).length) {
        html += '</li></ul>';
    }
    
    return html.split('\n').map(line => `<p>${line}</p>`).join('').replace(/<p><\/p>/g, '');
};


export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);
    
     useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'model', parts: [{ text: "Hello! I'm the FANN Assistant, your virtual guide. How can I help you with your exhibition, event, or interior design questions today?" }] }
            ]);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', parts: [{ text: input }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: newMessages }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to get response.');
            }

            const data = await response.json();
            const aiMessage: Message = { role: 'model', parts: [{ text: data.content }], sources: data.sources };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            const errorMessage: Message = { role: 'model', parts: [{ text: `Sorry, I encountered an error. Please try again. (${error instanceof Error ? error.message : 'Unknown error'})` }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const fabVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { delay: 0.5, type: 'spring' } },
    } as const;

    const chatWindowVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    } as const;

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-6 bg-fann-gold text-fann-charcoal w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-fann-gold/20"
                variants={fabVariants}
                initial="hidden"
                animate={isOpen ? 'hidden' : 'visible'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open Chat"
            >
                <MessageSquare size={32} />
            </motion.button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={chatWindowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed bottom-24 left-6 w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-fann-charcoal border border-white/10 rounded-lg shadow-2xl flex flex-col z-50"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b border-white/10 bg-fann-charcoal-light rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <Bot className="text-fann-gold" size={24} />
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-white">FANN Assistant</h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </header>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-black/30">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex gap-3 my-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-fann-gold flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-fann-charcoal" /></div>}
                                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-fann-gold text-fann-charcoal font-medium' : 'bg-fann-charcoal-light border border-white/10 text-gray-200'}`}>
                                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.parts[0].text) }} className="prose prose-sm prose-invert max-w-none prose-p:my-1" />
                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 border-t border-white/10 pt-2">
                                                <h4 className="text-xs font-bold flex items-center gap-1 text-gray-400 mb-1"><BookOpen size={12}/> Sources:</h4>
                                                <ul className="text-xs space-y-1">
                                                    {message.sources.map((source, i) => (
                                                        <li key={i}>
                                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-fann-gold break-all" title={source.title}>{source.title || new URL(source.uri).hostname}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><User size={18} className="text-gray-300" /></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 my-4 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-fann-gold flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-fann-charcoal" /></div>
                                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-fann-charcoal-light border border-white/10">
                                        <Loader2 className="animate-spin text-fann-gold" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <footer className="p-4 border-t border-white/10 bg-fann-charcoal-light rounded-b-lg">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about our services..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:border-fann-gold text-white placeholder-gray-500"
                                />
                                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-fann-gold text-fann-charcoal w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50 hover:bg-white transition-colors">
                                    <Send size={20} />
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};