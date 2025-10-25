import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

interface EmailCaptureModalProps {
  designType: string;
  onSuccess: (email: string) => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ designType, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate account creation/lookup
    setTimeout(() => {
        setIsLoading(false);
        onSuccess(email);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-fann-charcoal-light w-full max-w-lg rounded-lg p-8 border border-fann-border text-white text-center"
      >
        <Mail className="mx-auto w-12 h-12 text-fann-gold mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Start Designing Your {designType} Space</h2>
        <p className="text-fann-light-gray mb-6">Get 2 free generations (8 professional renders).</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
            }}
            placeholder="your.email@company.com"
            className="w-full bg-fann-charcoal border border-fann-border rounded-md px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-fann-gold"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fann-teal text-white font-bold py-3 rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity disabled:bg-fann-light-gray disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Continue to Generate'}
          </button>
        </form>

        <div className="text-left text-sm text-fann-light-gray mt-6 space-y-2">
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-fann-teal" /> Save your designs and access them anytime.</p>
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-fann-teal" /> Get design tips and inspiration via email.</p>
            <p className="flex items-center gap-2"><CheckCircle size={16} className="text-fann-teal" /> Receive special offers and updates.</p>
        </div>

        <p className="text-xs text-fann-light-gray mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default EmailCaptureModal;
