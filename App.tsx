



import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import AIDesignStudioPage from './pages/AIDesignStudioPage';
import ExhibitionStudioPage from './pages/ExhibitionStudioPage';
import EventStudioPage from './pages/EventStudioPage';
import InteriorStudioPage from './pages/InteriorStudioPage';
import EventsCalendarPage from './pages/EventsCalendarPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import InsightsPage from './pages/InsightsPage';
import { ApiKeyProvider } from './context/ApiKeyProvider';
import ROICalculatorPage from './pages/ROICalculatorPage';

const App: React.FC = () => {
    const location = useLocation();

    return (
        <ApiKeyProvider>
            <Layout>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/fann-studio" element={<AIDesignStudioPage />} />
                        <Route path="/fann-studio/exhibition" element={<ExhibitionStudioPage />} />
                        <Route path="/fann-studio/event" element={<EventStudioPage />} />
                        <Route path="/fann-studio/interior" element={<InteriorStudioPage />} />
                        <Route path="/events-calendar" element={<EventsCalendarPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/roi-calculator" element={<ROICalculatorPage />} />
                    </Routes>
                </AnimatePresence>
            </Layout>
        </ApiKeyProvider>
    );
};

export default App;