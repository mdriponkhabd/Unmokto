import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, Grid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ToolConfig, ToolCategory } from '../types';
import { ToolIcon } from '../components/common/ToolIcon';
import { MetaManager } from '../components/seo/MetaManager';
import { AdSlot } from '../components/ads/AdSlot';

interface AllToolsPageProps {
  onNavigate: (path: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ onNavigate }) => {
  const { tools, settings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (!t.enabled) return false;
      const matchSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [tools, search, selectedCategory]);

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title="All Free Online Tools – Directory of Utilities"
        description="Browse all 18+ free online utilities on Unmokto. Compress images, PDFs, videos, generate QR codes, calculate BMI and age, and convert file formats."
        canonicalPath="/tools"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
            <Grid className="h-3.5 w-3.5" />
            <span>Complete Tools Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            All Free Online Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Browse our full collection of browser-based utilities designed for privacy, speed, and productivity.
          </p>

          {/* Search bar */}
          <div className="relative mt-6 max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tool name or feature..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'image', label: 'Image' },
              { id: 'pdf', label: 'PDF' },
              { id: 'video', label: 'Video' },
              { id: 'text', label: 'Text' },
              { id: 'calculator', label: 'Calculators' },
              { id: 'utility', label: 'Other Useful Tools' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ad Slot */}
        <AdSlot placementKey="homepage_top" />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {filtered.map((t) => (
            <div
              key={t.slug}
              onClick={() => onNavigate(`/tools/${t.slug}`)}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ToolIcon name={t.icon} className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">
                    {t.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {t.shortDesc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Use Tool Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] text-slate-400">Free</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ad Slot */}
        <AdSlot placementKey="homepage_bottom" />
      </div>
    </div>
  );
};
