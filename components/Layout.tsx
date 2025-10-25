import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-fann-charcoal">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout;