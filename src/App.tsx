import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdSlot } from './components/ads/AdSlot';
import { AdGlobalScripts } from './components/ads/AdGlobalScripts';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ToolPageWrapper } from './pages/ToolPageWrapper';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import { ToolCategory } from './types';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route: Admin
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminPortal onNavigateHome={() => navigate('/')} />;
  }

  // Parse path
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath === '/tools') {
      return <AllToolsPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '').split('/')[0];
      return <ToolPageWrapper slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const cat = currentPath.replace('/category/', '').split('/')[0] as ToolCategory;
      return <CategoryPage category={cat} onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage />;
    }

    if (currentPath === '/terms-of-service') {
      return <TermsOfServicePage />;
    }

    if (currentPath === '/disclaimer') {
      return <DisclaimerPage />;
    }

    // Default to Home
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Global Adsterra Background Scripts (Popunder, Social Bar, Analytics) */}
      <AdGlobalScripts />

      {/* Global Header */}
      <Header currentPath={currentPath} onNavigate={navigate} />

      {/* Global Header Ad Slot */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdSlot placementKey="header_ad" />
      </div>

      {/* Page Content */}
      <div className="flex-1">{renderRoute()}</div>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
