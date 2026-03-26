import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage'; // Import
import AIDesignStudioPage from './pages/AIDesignStudioPage';
import ExhibitionStudioPage from './pages/ExhibitionStudioPage';
import DesignResultPage from './pages/DesignResultPage';
import EventStudioPage from './pages/EventStudioPage';
import EventResultPage from './pages/EventResultPage';
import InteriorStudioPage from './pages/InteriorStudioPage';
import InteriorResultPage from './pages/InteriorResultPage';
import EventsCalendarPage from './pages/EventsCalendarPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import InsightsPage from './pages/InsightsPage';
import { ApiKeyProvider } from './context/ApiKeyProvider';
import ROICalculatorPage from './pages/ROICalculatorPage';
import CustomStandsPage from './pages/services/CustomStandsPage';
import ModularSystemsPage from './pages/services/ModularSystemsPage';
import TurnkeyServicesPage from './pages/services/TurnkeyServicesPage';
import FabricationPage from './pages/services/FabricationPage';
import FitOutPage from './pages/services/FitOutPage';
import TestimonialsPage from './pages/TestimonialsPage';

// New Lead Magnet Pages
import ExhibitionGuidePage from './pages/resources/ExhibitionGuidePage';
import TrendsReportPage from './pages/resources/TrendsReportPage';
import CostCalculatorPage from './pages/resources/CostCalculatorPage';
import CostGuidePage from './pages/resources/CostGuidePage';
import ConsultationPage from './pages/ConsultationPage';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <ApiKeyProvider>
      <Layout>
        <AnimatePresence mode=\"wait\">
          <Routes location={location} key={location.pathname}>
            <Route path=\"/\" element={<HomePage />} />
            <Route path=\"/services\" element={<ServicesPage />} />
            {/* Service Detail Pages */}
            <Route path=\"/services/custom-exhibition-stands-dubai\" element={<CustomStandsPage />} />
            <Route path=\"/services/modular-exhibition-systems-dubai\" element={<ModularSystemsPage />} />
            <Route path=\"/services/turnkey-exhibition-services-uae\" element={<TurnkeyServicesPage />} />
            <Route path=\"/services/exhibition-stand-fabrication-dubai\" element={<FabricationPage />} />
            <Route path=\"/services/interior-fitout-exhibition-spaces-dubai\" element={<FitOutPage />} />
            <Route path=\"/portfolio\" element={<PortfolioPage />} />
            <Route path=\"/portfolio/:id\" element={<ProjectDetailsPage />} />
            <Route path=\"/events\" element={<EventsCalendarPage />} />
            <Route path=\"/about\" element={<AboutPage />} />
            <Route path=\"/contact\" element={<ContactPage />} />
            <Route path=\"/insights\" element={<InsightsPage />} />
            <Route path=\"/ai-design-studio\" element={<AIDesignStudioPage />} />
            <Route path=\"/exhibition-studio\" element={<ExhibitionStudioPage />} />
            <Route path=\"/design-result\" element={<DesignResultPage />} />
            <Route path=\"/event-studio\" element={<EventStudioPage />} />
            <Route path=\"/event-result\" element={<EventResultPage />} />
            <Route path=\"/interior-studio\" element={<InteriorStudioPage />} />
            <Route path=\"/interior-result\" element={<InteriorResultPage />} />
            <Route path=\"/roi-calculator\" element={<ROICalculatorPage />} />
            <Route path=\"/testimonials\" element={<TestimonialsPage />} />
            {/* Lead Magnet Routes */}
            <Route path=\"/resources/exhibition-guide\" element={<ExhibitionGuidePage />} />
            <Route path=\"/resources/trends-report\" element={<TrendsReportPage />} />
            <Route path=\"/resources/cost-calculator\" element={<CostCalculatorPage />} />
            <Route path=\"/resources/cost-guide\" element={<CostGuidePage />} />
            <Route path=\"/consultation\" element={<ConsultationPage />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </ApiKeyProvider>
  );
};

export default App;
