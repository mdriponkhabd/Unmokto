import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminAdsManager } from './AdminAdsManager';
import { AdminToolsManager } from './AdminToolsManager';
import { AdminSeoManager } from './AdminSeoManager';
import { AdminSiteSettings } from './AdminSiteSettings';
import { AdminPages } from './AdminPages';
import { AdminAnalytics } from './AdminAnalytics';

interface AdminPortalProps {
  onNavigateHome: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigateHome }) => {
  const { adminToken, setAdminToken } = useApp();
  const [currentTab, setCurrentTab] = useState<AdminTab>('ads'); // Default directly to requested Advertisement Manager!
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!adminToken) {
      setIsAuthenticated(false);
      setIsVerifying(false);
      return;
    }

    fetch('/api/auth/check', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => {
        if (r.ok) {
          setIsAuthenticated(true);
        } else {
          setAdminToken(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // In local development or transient state, trust token if present
        setIsAuthenticated(Boolean(adminToken));
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [adminToken]);

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent"></div>
          <p className="mt-3 text-xs text-slate-400">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onExit={onNavigateHome}
      />
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard onSelectTab={setCurrentTab} />;
      case 'ads':
        return <AdminAdsManager />;
      case 'tools':
        return <AdminToolsManager />;
      case 'seo':
        return <AdminSeoManager />;
      case 'settings':
        return <AdminSiteSettings />;
      case 'pages':
        return <AdminPages />;
      case 'analytics':
        return <AdminAnalytics />;
      default:
        return <AdminAdsManager />;
    }
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onLogout={() => {
        setAdminToken(null);
        setIsAuthenticated(false);
      }}
      onViewPublic={onNavigateHome}
    >
      {renderTabContent()}
    </AdminLayout>
  );
};
