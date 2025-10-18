import React from 'react';
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-fann-charcoal text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-fann-gold mb-4">Welcome to Fann</h1>
                <p className="text-xl">Your gateway to amazing experiences.</p>
                <Routes>
                    <route path="/" element={<div className="mt-8 text-green-400">✅ Router is working too!</div>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
