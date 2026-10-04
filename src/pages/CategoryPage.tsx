import React from 'react';
import { ArrowRight, Sparkles, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ToolCategory } from '../types';
import { ToolIcon } from '../components/common/ToolIcon';
import { MetaManager } from '../components/seo/MetaManager';
import { AdSlot } from '../components/ads/AdSlot';

interface CategoryPageProps {
  category: ToolCategory;
  onNavigate: (path: string) => void;
}

const CATEGORY_META: Record<ToolCategory, { title: string; desc: string; headline: string }> = {
  image: {
    title: 'Free Online Image Tools – Compress, Resize & Convert',
    desc: 'Compress, resize, crop, and convert images online with Unmokto. Convert JPG to PNG, PNG to JPG, erase backgrounds and more with 100% client-side privacy.',
    headline: 'Online Image Editing & Conversion Tools',
  },
  pdf: {
    title: 'Free Online PDF Tools – Convert & Compress PDF Documents',
    desc: 'Extract JPG images from PDF, compile JPG photos into PDF documents, and compress PDFs for email without uploading files to remote servers.',
    headline: 'Online PDF Management & Conversion Tools',
  },
  video: {
    title: 'Free Online Video Tools – Compress Videos & Download Thumbnails',
    desc: 'Compress MP4, WebM and MOV video clips in your browser. Download YouTube video thumbnails in 1080p Full HD resolution for free.',
    headline: 'Online Video Compression & Media Tools',
  },
  text: {
    title: 'Free Online Text Tools – Word Counter & Text Case Converter',
    desc: 'Count words, characters, sentences and reading time. Convert text case to UPPERCASE, lowercase, Title Case, camelCase, and snake_case.',
    headline: 'Online Text Analysis & Typography Tools',
  },
  calculator: {
    title: 'Free Online Calculators – Age Calculator & BMI Calculator',
    desc: 'Calculate exact chronological age down to the second with birthday countdowns. Determine Body Mass Index (BMI) with healthy weight and calorie estimates.',
    headline: 'Online Health & Chronological Calculators',
  },
  utility: {
    title: 'Useful Free Online Utilities – QR Codes & Passwords',
    desc: 'Generate secure random passwords, create custom styled QR codes, and shorten long links with instant QR codes for free.',
    headline: 'Everyday Online Productivity Utilities',
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const { tools } = useApp();
  const info = CATEGORY_META[category] || {
    title: `${category.toUpperCase()} Tools – Unmokto`,
    desc: `Free online ${category} tools.`,
    headline: `${category.toUpperCase()} Online Utilities`,
  };

  const categoryTools = tools.filter((t) => t.category === category && t.enabled);

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={info.title}
        description={info.desc}
        canonicalPath={`/category/${category}`}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3 capitalize">
            <Folder className="h-3.5 w-3.5" />
            <span>{category} Tools Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white capitalize">
            {info.headline}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {info.desc}
          </p>
        </div>

        <AdSlot placementKey="homepage_top" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-10">
          {categoryTools.map((t) => (
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
                  Launch Tool
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] text-slate-400">100% Free</span>
              </div>
            </div>
          ))}
        </div>

        <AdSlot placementKey="homepage_bottom" />
      </div>
    </div>
  );
};
