import React from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Wrench,
  Search,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type AdminTab =
  | 'dashboard'
  | 'ads'
  | 'tools'
  | 'seo'
  | 'settings'
  | 'pages'
  | 'analytics';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onViewPublic,
  children,
}) => {
  const { settings, ads } = useApp();

  const activeAdsCount = Object.values(ads).filter((a) => a.enabled && a.code?.trim()).length;

  const menuItems: Array<{ id: AdminTab; label: string; icon: any; badge?: number | string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ads', label: 'Advertisement Manager', icon: DollarSign, badge: activeAdsCount },
    { id: 'tools', label: 'Tools Manager', icon: Wrench },
    { id: 'seo', label: 'SEO Manager', icon: Search },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {settings.siteName || 'Unmokto'} <span className="text-emerald-400 font-mono text-xs">ADMIN</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            {menuItems.map((item) => {
              const targetTab = (item as any).idReal || item.id;
              const isActive = currentTab === targetTab;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(targetTab)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer controls */}
        <div className="border-t border-slate-800 p-4 space-y-2">
          <button
            onClick={onViewPublic}
            className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Portal
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-extrabold capitalize text-white">
              {currentTab === 'ads' ? 'Adsterra Advertisement Manager' : currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewPublic}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Visit Site</span>
            </button>
            <button
              onClick={onLogout}
              className="rounded-lg bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-900/40"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile Sub-menu */}
        <div className="md:hidden border-b border-slate-800 bg-slate-950 p-2 overflow-x-auto flex gap-1">
          {menuItems.map((item) => {
            const targetTab = (item as any).idReal || item.id;
            const isActive = currentTab === targetTab;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(targetTab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
