import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const AIDesignStudioPage = lazy(() => import('./pages/AIDesignStudioPage'));
const ExhibitionStudioPage = lazy(() => import('./pages/ExhibitionStudioPage'));
const DesignResultPage = lazy(() => import('./pages/DesignResultPage'));
const EventStudioPage = lazy(() => import('./pages/EventStudioPage'));
const EventResultPage = lazy(() => import('./pages/EventResultPage'));
const InteriorStudioPage = lazy(() => import('./pages/InteriorStudioPage'));
const InteriorResultPage = lazy(() => import('./pages/InteriorResultPage'));
const EventsCalendarPage = lazy(() => import('./pages/EventsCalendarPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
import { ApiKeyProvider } from './context/ApiKeyProvider';
const ROICalculatorPage = lazy(() => import('./pages/ROICalculatorPage'));
const CustomStandsPage = lazy(() => import('./pages/services/CustomStandsPage'));
const ModularSystemsPage = lazy(() => import('./pages/services/ModularSystemsPage'));
const TurnkeyServicesPage = lazy(() => import('./pages/services/TurnkeyServicesPage'));
const FabricationPage = lazy(() => import('./pages/services/FabricationPage'));
const FitOutPage = lazy(() => import('./pages/services/FitOutPage'));
import GoogleAnalytics from './components/GoogleAnalytics'; // Import the tracker

// New Lead Magnet Pages
const ExhibitionGuidePage = lazy(() => import('./pages/resources/ExhibitionGuidePage'));
const CostCalculatorPage = lazy(() => import('./pages/resources/CostCalculatorPage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const CommercialFitOutPage = lazy(() => import('./pages/services/CommercialFitOutPage'));
const FitOutDubaiPage = lazy(() => import('./pages/services/FitOutDubaiPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
    const location = useLocation();

    return (
        <ApiKeyProvider>
            <GoogleAnalytics /> {/* Fired on every route change */}
            <Layout>
                <Suspense fallback={<div className="min-h-screen bg-fann-charcoal" />}>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        {/* Service Detail Pages */}
                        <Route path="/services/custom-exhibition-stands-dubai" element={<CustomStandsPage />} />
                        <Route path="/services/modular-exhibition-systems-dubai" element={<ModularSystemsPage />} />
                        <Route path="/services/turnkey-exhibition-services-uae" element={<TurnkeyServicesPage />} />
                        <Route path="/services/exhibition-stand-fabrication-dubai" element={<FabricationPage />} />
                        <Route path="/services/interior-fitout-exhibition-spaces-dubai" element={<FitOutPage />} />
                        
                        <Route path="/services/commercial-interior-fit-out-dubai" element={<CommercialFitOutPage />} />
                        <Route path="/fit-out-dubai" element={<FitOutDubaiPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
                        
                        <Route path="/fann-studio" element={<AIDesignStudioPage />} />
                        <Route path="/fann-studio/exhibition" element={<ExhibitionStudioPage />} />
                        <Route path="/fann-studio/exhibition/result" element={<DesignResultPage />} />
                        <Route path="/fann-studio/event" element={<EventStudioPage />} />
                        <Route path="/fann-studio/event/result" element={<EventResultPage />} />
                        <Route path="/fann-studio/interior" element={<InteriorStudioPage />} />
                        <Route path="/fann-studio/interior/result" element={<InteriorResultPage />} />
                        <Route path="/events-calendar" element={<EventsCalendarPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/roi-calculator" element={<ROICalculatorPage />} />
                        
                        {/* Resources & Lead Magnets */}
                        <Route path="/resources/exhibition-guide" element={<ExhibitionGuidePage />} />
                        <Route path="/resources/cost-calculator" element={<CostCalculatorPage />} />
                        <Route path="/book-consultation" element={<ConsultationPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AnimatePresence>
                </Suspense>
            </Layout>
        </ApiKeyProvider>
    );
};

export default App;
