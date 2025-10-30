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


const Chatbot: React.FC = () => {
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
    };

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
                            <div className="flex items-center gap