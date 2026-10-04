import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdPlacement, SiteSettings, SeoSettings, ToolConfig } from '../types';
import { INITIAL_TOOLS } from '../data/toolsData';

interface AppContextType {
  tools: ToolConfig[];
  ads: Record<string, AdPlacement>;
  settings: SiteSettings;
  seo: SeoSettings;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  recordToolUsage: (slug: string) => void;
  refreshData: () => Promise<void>;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  isAdminLoggedIn: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Unmokto',
  tagline: 'Free Online Tools for Everyone',
  primaryColor: '#059669',
  secondaryColor: '#0284c7',
  contactEmail: 'support@unmokto.com',
  footerText: '© 2026 Unmokto. All Rights Reserved. Fast, private browser utilities.',
  socialLinks: {
    twitter: 'https://twitter.com/unmokto',
    github: 'https://github.com/unmokto',
  },
  googleAnalyticsId: '',
  googleSearchConsole: '',
  customHeaderCode: '',
  customFooterCode: '',
};

const DEFAULT_SEO: SeoSettings = {
  homepageTitle: 'Unmokto – Free Online Tools for Everyone',
  homepageMetaDescription: 'Compress images & PDFs, convert file formats, create QR codes, calculate age & BMI, edit text and more with 100% free browser tools. No registration required.',
  ogImage: '',
  robotsSettings: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://unmokto.com/sitemap.xml',
  customHeaderScripts: '',
  customFooterScripts: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<ToolConfig[]>(INITIAL_TOOLS);
  const [ads, setAds] = useState<Record<string, AdPlacement>>({});
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return localStorage.getItem('unmokto_admin_token') || null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('unmokto_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const setAdminToken = (token: string | null) => {
    setAdminTokenState(token);
    if (token) {
      localStorage.setItem('unmokto_admin_token', token);
    } else {
      localStorage.removeItem('unmokto_admin_token');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('unmokto_theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Dynamically update favicon in browser tab when changed in Admin settings
  useEffect(() => {
    if (settings.faviconUrl && settings.faviconUrl.trim()) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl.trim();
    }
  }, [settings.faviconUrl]);

  // Sync document title prefix with company/site name
  useEffect(() => {
    const brandName = settings.companyName || settings.siteName;
    if (brandName && !document.title.includes(brandName)) {
      document.title = `${brandName} – ${settings.tagline || 'Free Online Tools for Everyone'}`;
    }
  }, [settings.companyName, settings.siteName, settings.tagline]);

  const fetchData = async () => {
    // 1. Initial check for local overrides (vital for Vercel static deployments)
    try {
      const localSettings = localStorage.getItem('unmokto_custom_settings');
      if (localSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(localSettings) }));
      }
      const localAds = localStorage.getItem('unmokto_custom_ads');
      if (localAds) {
        setAds((prev) => ({ ...prev, ...JSON.parse(localAds) }));
      }
    } catch {
      // ignore
    }

    try {
      // 2. Fetch from backend API
      const [settingsRes, adsRes, seoRes, toolsRes] = await Promise.allSettled([
        fetch('/api/public/settings').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/public/ads').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/public/seo').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/public/tools').then((r) => (r.ok ? r.json() : null)),
      ]);

      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        setSettings((prev) => ({ ...prev, ...settingsRes.value }));
      }
      if (adsRes.status === 'fulfilled' && adsRes.value) {
        setAds((prev) => ({ ...prev, ...adsRes.value }));
      }
      if (seoRes.status === 'fulfilled' && seoRes.value) {
        setSeo((prev) => ({ ...prev, ...seoRes.value }));
      }
      if (toolsRes.status === 'fulfilled' && Array.isArray(toolsRes.value) && toolsRes.value.length > 0) {
        setTools(toolsRes.value);
      }
    } catch (err) {
      console.warn('API fetch warning, using client fallback:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recordToolUsage = async (slug: string) => {
    try {
      fetch('/api/public/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, type: 'tool_use' }),
      }).catch(() => {});
    } catch {
      // ignore silently
    }
  };

  return (
    <AppContext.Provider
      value={{
        tools,
        ads,
        settings,
        seo,
        theme,
        toggleTheme,
        recordToolUsage,
        refreshData: fetchData,
        adminToken,
        setAdminToken,
        isAdminLoggedIn: Boolean(adminToken),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
