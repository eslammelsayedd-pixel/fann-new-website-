import React, { useState, useRef, useEffect } from 'react';
// FIX: Removed 'Variants' from framer-motion import as it was causing type errors.
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


// FIX: Changed to a named export to resolve import issues.
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

    // FIX: Removed the explicit 'Variants' type annotation to resolve type errors.
    const fabVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { delay: 0.5, type: 'spring' } },
    };

    // FIX: Removed the explicit 'Variants' type annotation to resolve type errors.
    const chatWindowVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 bg-fann-gold text-fann-charcoal w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50"
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
                        className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-fann-teal rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-fann-border"
                    >
                        {/* Header */}
                        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-fann-border">
                            <div className="flex items-center gap-3">
                                <Bot className="text-fann-gold" size={24} />
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-fann-teal dark:text-fann-peach">FANN Assistant</h3>
                                    <p className="text-xs text-fann-light-gray flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-fann-light-gray hover:text-fann-teal dark:hover:text-fann-peach">
                                <X size={24} />
                            </button>
                        </header>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-fann-peach/20 dark:bg-fann-accent-teal/50">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex gap-3 my-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'model' && <div className="w-8 h-8 rounded-full bg-fann-gold flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-fann-charcoal" /></div>}
                                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-fann-teal-dark text-fann-teal dark:text-fann-peach'}`}>
                                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.parts[0].text) }} className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1" />
                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 border-t border-gray-300 dark:border-fann-border pt-2">
                                                <h4 className="text-xs font-bold flex items-center gap-1 text-fann-light-gray mb-1"><BookOpen size={12}/> Sources:</h4>
                                                <ul className="text-xs space-y-1">
                                                    {message.sources.map((source, i) => (
                                                        <li key={i}>
                                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-500 dark:text-blue-400 break-all" title={source.title}>{source.title || new URL(source.uri).hostname}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"><User size={18} className="text-gray-600" /></div>}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 my-4 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-fann-gold flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-fann-charcoal" /></div>
                                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-gray-200 dark:bg-fann-teal-dark">
                                        <Loader2 className="animate-spin text-fann-light-gray" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <footer className="p-4 border-t border-gray-200 dark:border-fann-border">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about our services..."
                                    className="flex-1 bg-fann-peach/50 dark:bg-fann-teal border border-fann-teal/20 dark:border-fann-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fann-accent-teal dark:focus:ring-fann-gold text-fann-teal dark:text-fann-peach"
                                />
                                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-fann-gold text-fann-charcoal w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50">
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