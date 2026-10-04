import React, { useState, useEffect } from 'react';
import {
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Shield,
  Eye,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectTab }) => {
  const { tools, ads, adminToken } = useApp();
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/overview', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setOverview(data);
      })
      .catch(() => {});
  }, [adminToken]);

  const activeAdsCount = Object.values(ads).filter((a) => a.enabled && a.code?.trim()).length;
  const activeToolsCount = tools.filter((t) => t.enabled).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/30 p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-3">
              <Zap className="h-3.5 w-3.5" />
              <span>Admin Control Center</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Platform Overview & Performance
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage Adsterra monetization slots, monitor tool activity, and optimize site SEO.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectTab('ads')}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
            >
              <DollarSign className="h-4 w-4" />
              <span>Manage Ads ({activeAdsCount} Active)</span>
            </button>
            <button
              onClick={() => onSelectTab('tools')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              <Wrench className="h-4 w-4" />
              <span>Configure Tools</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Tool Sessions',
            val: overview?.totalViews?.toLocaleString() || '1,420',
            icon: Eye,
            sub: 'Zero server uploads',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            title: 'Active Tools',
            val: `${activeToolsCount} / ${tools.length}`,
            icon: Wrench,
            sub: '100% Client-side',
            color: 'text-sky-400',
            bg: 'bg-sky-500/10',
          },
          {
            title: 'Active Adsterra Slots',
            val: `${activeAdsCount} / 13`,
            icon: DollarSign,
            sub: `${13 - activeAdsCount} available to monetize`,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            title: 'Privacy Score',
            val: '100%',
            icon: Shield,
            sub: 'No user accounts stored',
            color: 'text-teal-400',
            bg: 'bg-teal-500/10',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className={`mt-3 text-2xl font-black ${stat.color}`}>{stat.val}</p>
              <p className="mt-1 text-[11px] text-slate-500">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Popular Tools & Monetization Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Tools */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Used Utilities
            </h2>
            <button
              onClick={() => onSelectTab('tools')}
              className="text-xs text-emerald-400 hover:underline"
            >
              View All Tools &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {[...tools]
              .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
              .slice(0, 5)
              .map((t, idx) => (
                <div
                  key={t.slug}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-500 w-4">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{t.category}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {t.usageCount || 0} uses
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Adsterra Placements Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Monetization Status
            </h2>
            <button
              onClick={() => onSelectTab('ads')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Configure Placements &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'header_ad', name: 'Header Ad' },
              { id: 'homepage_top', name: 'Homepage Top Ad' },
              { id: 'tool_top', name: 'Tool Page Top Ad' },
              { id: 'tool_middle', name: 'Tool Page Content Ad' },
              { id: 'sidebar_desktop', name: 'Sidebar Ad Desktop' },
              { id: 'popunder', name: 'Popunder Code' },
              { id: 'social_bar', name: 'Social Bar Code' },
            ].map((slot) => {
              const active = ads[slot.id]?.enabled && ads[slot.id]?.code?.trim();
              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-3.5 py-2 text-xs"
                >
                  <span className="font-medium text-slate-300">{slot.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
