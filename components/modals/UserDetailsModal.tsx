import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Loader2 } from 'lucide-react';
import { countryCodes } from '../../constants';
import { UserDetails } from '../../context/UserProvider';

interface UserDetailsModalProps {
  designType: string;
  onSuccess: (details: UserDetails) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ designType, onSuccess }) => {
  const [details, setDetails] = useState<UserDetails>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+971',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!details.firstName || !details.lastName || !details.email || !details.phone) {
        setError('All fields are required.');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({
        ...details,
        [e.target.name]: e.target.value
    });
    if (error) setError('');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);

    // Simulate account creation/lookup
    setTimeout(() => {
        setIsLoading(false);
        onSuccess(details);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-fann-charcoal-light w-full max-w-lg rounded-lg p-8 border border-fann-border text-white text-center"
      >
        <UserPlus className="mx-auto w-12 h-12 text-fann-gold mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Unlock Your First Design</h2>
        <p className="text-fann-light-gray mb-6">Provide your details to get 2 free {designType} generations.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-fann-light-gray mb-1 block">First Name</label>
                <input type="text" name="firstName" value={details.firstName} onChange={handleChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" required />
            </div>
            <div>
                <label className="text-sm text-fann-light-gray mb-1 block">Last Name</label>
                <input type="text" name="lastName" value={details.lastName} onChange={handleChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-fann-light-gray mb-1 block">Email</label>
            <input type="email" name="email" value={details.email} onChange={handleChange} className="w-full bg-fann-charcoal border border-fann-border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm text-fann-light-gray mb-1 block">Phone Number</label>
            <div className="flex">
                <select name="countryCode" value={details.countryCode} onChange={handleChange} className="bg-fann-charcoal border border-fann-border rounded-l-md px-2 py-2 focus:outline-none">
                    {countryCodes.map(c => <option key={c.code} value={c.dial_code}>{c.code} ({c.dial_code})</option>)}
                </select>
                <input type="tel" name="phone" value={details.phone} onChange={handleChange} className="w-full bg-fann-charcoal border-t border-r border-b border-fann-border rounded-r-md px-3 py-2" required />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
          
          <div className="pt-2">
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-fann-teal text-white font-bold py-3 rounded-full uppercase tracking-wider hover:opacity-90 transition-opacity disabled:bg-fann-light-gray disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2"/>}
                {isLoading ? 'Saving...' : 'Start Designing'}
            </button>
          </div>
        </form>

        <p className="text-xs text-fann-light-gray mt-6 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;