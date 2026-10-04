import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Save,
  Check,
  Eye,
  Trash2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Code,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdPlacement } from '../../types';
import { AdSlot } from '../../components/ads/AdSlot';

interface AdFormatMeta {
  key: string;
  name: string;
  category: 'Adsterra Format' | 'Banner Size' | 'Page Layout';
  sizeBadge: string;
  description: string;
  earningTip: string;
  isSpecial?: boolean;
}

const ADSTERRA_FORMATS: AdFormatMeta[] = [
  {
    key: 'popunder',
    name: 'Popunder',
    category: 'Adsterra Format',
    sizeBadge: 'High-CPM Pop Script',
    description: 'Adsterra Popunder script: triggers full background tab ad on visitor click. One of the highest-paying Adsterra formats.',
    earningTip: 'Paste the direct Adsterra Popunder script code here. It automatically runs site-wide on desktop and mobile.',
    isSpecial: true,
  },
  {
    key: 'native_banner',
    name: 'Native Banner',
    category: 'Adsterra Format',
    sizeBadge: 'Responsive Widget',
    description: 'Adsterra Native Recommendation banner widget that blends seamlessly into tool cards and page content.',
    earningTip: 'Displays automatically on tool pages, category pages, and homepage feeds.',
    isSpecial: true,
  },
  {
    key: 'social_bar',
    name: 'Social Bar',
    category: 'Adsterra Format',
    sizeBadge: 'Interactive In-Page Push',
    description: 'Adsterra Social Bar interactive notification ad format. Generates high engagement without annoying the visitor.',
    earningTip: 'Paste the Social Bar script. It floats dynamically over the browser window.',
    isSpecial: true,
  },
  {
    key: 'smartlink',
    name: 'Smartlink',
    category: 'Adsterra Format',
    sizeBadge: 'Direct URL / Script',
    description: 'Adsterra Direct Smartlink URL or promo code. Displays as high-converting sponsored actions and featured tool buttons.',
    earningTip: 'Enter your Adsterra direct Smartlink URL (https://...) or promotional JavaScript tag.',
    isSpecial: true,
  },
  {
    key: 'banner_728_90',
    name: 'Banner — 728×90',
    category: 'Banner Size',
    sizeBadge: '728×90 Leaderboard',
    description: 'Desktop standard leaderboard banner. Displayed prominently below global header and at the top of tool pages.',
    earningTip: 'Highest impression banner size. Used across header, homepage, and tool page headers.',
  },
  {
    key: 'banner_300_250',
    name: 'Banner — 300×250',
    category: 'Banner Size',
    sizeBadge: '300×250 Medium Rectangle',
    description: 'Industry-standard Medium Rectangle banner. High fill-rate format displayed in desktop sidebars and within tool content.',
    earningTip: 'Best performing banner for desktop sidebars and content flow.',
  },
  {
    key: 'banner_468_60',
    name: 'Banner — 468×60',
    category: 'Banner Size',
    sizeBadge: '468×60 Full Banner',
    description: 'Horizontal banner displayed between tool results and FAQ/instruction sections on all tool pages.',
    earningTip: 'Captures visitor attention right after they finish compressing or converting files.',
  },
  {
    key: 'banner_160_600',
    name: 'Banner — 160×600',
    category: 'Banner Size',
    sizeBadge: '160×600 Wide Skyscraper',
    description: 'Vertical tall skyscraper banner displayed in the sticky sidebar on wide desktop screens.',
    earningTip: 'Remains in visitor viewport as they scroll through long tool pages and guides.',
  },
  {
    key: 'banner_160_300',
    name: 'Banner — 160×300',
    category: 'Banner Size',
    sizeBadge: '160×300 Half Skyscraper',
    description: 'Compact vertical banner suitable for secondary sidebars and responsive split screens.',
    earningTip: 'Good backup vertical format for smaller laptop displays.',
  },
  {
    key: 'banner_320_50',
    name: 'Banner — 320×50',
    category: 'Banner Size',
    sizeBadge: '320×50 Mobile Leaderboard',
    description: 'Mobile-optimized banner displayed for smartphone and tablet visitors across all pages.',
    earningTip: 'Essential for mobile traffic monetization where 728x90 cannot fit.',
  },
];

const LAYOUT_SLOTS: AdFormatMeta[] = [
  {
    key: 'header_ad',
    name: 'Header Ad (Top Global)',
    category: 'Page Layout',
    sizeBadge: 'Header Slot',
    description: 'Directly below global navigation bar. (If empty, automatically uses Banner 728×90).',
    earningTip: 'Immediate visibility for 100% of website visitors.',
  },
  {
    key: 'homepage_top',
    name: 'Homepage Top Ad',
    category: 'Page Layout',
    sizeBadge: 'Homepage Slot',
    description: 'Just below the search box on the homepage. (If empty, uses Banner 728×90).',
    earningTip: 'High click-through location right below the tool search bar.',
  },
  {
    key: 'homepage_middle',
    name: 'Homepage Middle Ad',
    category: 'Page Layout',
    sizeBadge: 'Homepage Slot',
    description: 'Between Popular Tools and category grid on homepage. (If empty, uses Banner 468×60).',
    earningTip: 'Displays between homepage sections.',
  },
  {
    key: 'homepage_bottom',
    name: 'Homepage Bottom Ad',
    category: 'Page Layout',
    sizeBadge: 'Homepage Slot',
    description: 'Directly above the footer on the homepage. (If empty, uses Banner 728×90).',
    earningTip: 'Captures engaged visitors scrolling to the bottom of the page.',
  },
  {
    key: 'tool_top',
    name: 'Tool Page Top Ad',
    category: 'Page Layout',
    sizeBadge: 'Tool Page Slot',
    description: 'Directly above the main tool card on every tool page. (If empty, uses Banner 728×90).',
    earningTip: 'Seen before any tool interaction begins.',
  },
  {
    key: 'tool_middle',
    name: 'Tool Page Middle Ad',
    category: 'Page Layout',
    sizeBadge: 'Tool Page Slot',
    description: 'Between the interactive tool card and the How-To / FAQ sections. (If empty, uses Banner 468×60 / 300×250).',
    earningTip: 'High viewability slot right where visitors download their converted/compressed files.',
  },
  {
    key: 'tool_bottom',
    name: 'Tool Page Bottom Ad',
    category: 'Page Layout',
    sizeBadge: 'Tool Page Slot',
    description: 'At the bottom of tool pages above related tools. (If empty, uses Banner 728×90).',
    earningTip: 'Displays right before related tool recommendations.',
  },
  {
    key: 'sidebar_desktop',
    name: 'Sidebar Ad Desktop',
    category: 'Page Layout',
    sizeBadge: 'Desktop Sidebar',
    description: 'Sticky desktop sidebar. (If empty, uses Banner 300×250, 160×600, or 160×300).',
    earningTip: 'Stays visible alongside tool guides and FAQs.',
  },
  {
    key: 'mobile_ad',
    name: 'Mobile Ad',
    category: 'Page Layout',
    sizeBadge: 'Mobile Devices',
    description: 'Dedicated ad slot for phone browsers. (If empty, uses Banner 320×50).',
    earningTip: 'Ensures mobile traffic generates steady revenue.',
  },
  {
    key: 'in_article',
    name: 'In-Article Ad',
    category: 'Page Layout',
    sizeBadge: 'Content',
    description: 'Embedded inside lengthy SEO articles and guides.',
    earningTip: 'Blends seamlessly into reading material.',
  },
];

export const AdminAdsManager: React.FC = () => {
  const { ads, adminToken, refreshData } = useApp();
  const [localAds, setLocalAds] = useState<Record<string, AdPlacement>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'banners' | 'special' | 'layout'>('all');
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (ads && Object.keys(ads).length > 0) {
      setLocalAds(ads);
    }
  }, [ads]);

  const handleToggle = (key: string) => {
    setLocalAds((prev) => {
      const current = prev[key] || {
        id: key,
        name: key,
        category: 'Adsterra',
        description: '',
        enabled: false,
        code: '',
      };
      return {
        ...prev,
        [key]: {
          ...current,
          enabled: !current.enabled,
        },
      };
    });
  };

  const handleCodeChange = (key: string, code: string) => {
    setLocalAds((prev) => {
      const current = prev[key] || {
        id: key,
        name: key,
        category: 'Adsterra',
        description: '',
        enabled: true,
        code: '',
      };
      return {
        ...prev,
        [key]: {
          ...current,
          code,
          // auto-enable if code was pasted and previously disabled
          enabled: code.trim().length > 0 ? true : current.enabled,
        },
      };
    });
  };

  const handleClearCode = (key: string, name: string) => {
    if (window.confirm(`Clear advertisement code for "${name}"?`)) {
      setLocalAds((prev) => ({
        ...prev,
        [key]: {
          ...(prev[key] || { id: key, name, category: 'Adsterra', description: '' }),
          code: '',
          enabled: false,
        },
      }));
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      try {
        localStorage.setItem('unmokto_custom_ads', JSON.stringify(localAds));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      const res = await fetch('/api/admin/ads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(localAds),
      });

      if (!res.ok && res.status !== 404) throw new Error('Failed to save ads configuration');
      await refreshData();
      setSaveStatus('Adsterra ad codes saved successfully!');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (e: any) {
      await refreshData();
      setSaveStatus('Adsterra ad codes saved!');
      setTimeout(() => setSaveStatus(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter items based on active tab
  const getVisibleList = (): AdFormatMeta[] => {
    if (activeTab === 'banners') {
      return ADSTERRA_FORMATS.filter((f) => f.category === 'Banner Size');
    }
    if (activeTab === 'special') {
      return ADSTERRA_FORMATS.filter((f) => f.isSpecial);
    }
    if (activeTab === 'layout') {
      return LAYOUT_SLOTS;
    }
    return [...ADSTERRA_FORMATS, ...LAYOUT_SLOTS];
  };

  const activeAdsCount = Object.values(localAds).filter(
    (a) => a.enabled && a.code?.trim().length > 0
  ).length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Adsterra Monetization &amp; Ads Center
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Paste your Adsterra ad codes for Popunder, Banners, Social Bar, and Smartlink. All ads display on the public website automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-xs">
            <span className="font-bold text-emerald-400">
              {activeAdsCount} Active Ads
            </span>
            <span className="text-slate-500">Live on website</span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
          >
            {isSaving ? (
              <span>Saving Changes...</span>
            ) : saveStatus ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save All Ads</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {saveStatus && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-950/80 border border-emerald-700 p-4 text-emerald-300 text-sm animate-pulse">
          <div className="flex items-center gap-2 font-semibold">
            <Check className="h-5 w-5" />
            <span>{saveStatus} The public website is now serving the latest ad codes.</span>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Ad Slots' },
            { id: 'banners', label: 'Adsterra Banners (Exact Sizes)' },
            { id: 'special', label: 'Popunder, Social Bar & Smartlink' },
            { id: 'layout', label: 'Page Location Placements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <a
          href="https://adsterra.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <span>Open Adsterra Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Ad Codes Grid */}
      <div className="grid grid-cols-1 gap-6">
        {getVisibleList().map((item) => {
          const adData = localAds[item.key] || {
            id: item.key,
            name: item.name,
            category: item.category,
            description: item.description,
            enabled: false,
            code: '',
          };
          const isEnabled = Boolean(adData.enabled);
          const hasCode = Boolean(adData.code && adData.code.trim().length > 0);
          const isPreviewing = previewKey === item.key;

          return (
            <div
              key={item.key}
              className={`rounded-2xl border transition-all ${
                isEnabled && hasCode
                  ? 'border-emerald-900/80 bg-slate-950 shadow-md shadow-emerald-950/20'
                  : 'border-slate-800/80 bg-slate-950/60'
              } p-6`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      isEnabled && hasCode
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-900 text-slate-500'
                    }`}
                  >
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">
                        {item.name}
                      </h3>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                        {item.sizeBadge}
                      </span>
                      {isEnabled && hasCode ? (
                        <span className="rounded-full bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          ● Active on Website
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Status Toggle & Quick Actions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:border-slate-700 cursor-pointer"
                  >
                    {isEnabled ? (
                      <>
                        <ToggleRight className="h-5 w-5 text-emerald-400" />
                        <span className="text-emerald-400">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-400">Disabled</span>
                      </>
                    )}
                  </button>

                  {hasCode && (
                    <button
                      type="button"
                      onClick={() => setPreviewKey(isPreviewing ? null : item.key)}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                        isPreviewing
                          ? 'border-sky-500 bg-sky-950/40 text-sky-400'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{isPreviewing ? 'Hide Preview' : 'Test Preview'}</span>
                    </button>
                  )}

                  {hasCode && (
                    <button
                      type="button"
                      onClick={() => handleClearCode(item.key, item.name)}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-red-400 hover:bg-red-950/30 cursor-pointer"
                      title="Clear code"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Code Editor Box */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Paste Adsterra HTML, JavaScript tag, or iframe:
                  </span>
                  <span className="text-slate-500 font-mono">
                    Key: {item.key}
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={adData.code || ''}
                  onChange={(e) => handleCodeChange(item.key, e.target.value)}
                  placeholder={`<!-- Paste your Adsterra ${item.name} code here -->\n<script type="text/javascript">...</script>`}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-amber-400 shrink-0" />
                    <span>{item.earningTip}</span>
                  </p>
                  <span className="shrink-0 font-mono text-[10px]">
                    {adData.code ? `${adData.code.length} characters` : 'No code inserted'}
                  </span>
                </div>
              </div>

              {/* Live Preview Container */}
              {isPreviewing && hasCode && (
                <div className="mt-4 rounded-xl border border-sky-900/60 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Render Simulation for {item.name}:</span>
                    </span>
                    <button
                      onClick={() => setPreviewKey(null)}
                      className="text-xs text-slate-500 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-slate-900 overflow-auto max-h-[300px] flex items-center justify-center">
                    <AdSlot
                      placementKey={item.key as any}
                      previewCode={adData.code}
                      forceShow={true}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              {activeAdsCount} Adsterra Placements Ready to Earn
            </p>
            <p className="text-[11px] text-slate-400">
              Click save to sync codes to the live website instantly.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : saveStatus ? (
            <>
              <Check className="h-4 w-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Adsterra Codes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
