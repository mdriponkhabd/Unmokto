import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ToolConfig, ToolCategory } from '../types';
import { ToolIcon } from '../components/common/ToolIcon';
import { AdSlot } from '../components/ads/AdSlot';
import { MetaManager } from '../components/seo/MetaManager';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { tools, settings, seo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (!tool.enabled) return false;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, activeCategory]);

  const popularTools = useMemo(() => {
    return [...tools].filter((t) => t.enabled).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 6);
  }, [tools]);

  const categories: Array<{ id: string; label: string; catKey?: ToolCategory }> = [
    { id: 'all', label: 'All Tools' },
    { id: 'image', label: 'Image Tools', catKey: 'image' },
    { id: 'pdf', label: 'PDF Tools', catKey: 'pdf' },
    { id: 'video', label: 'Video Tools', catKey: 'video' },
    { id: 'text', label: 'Text Tools', catKey: 'text' },
    { id: 'calculator', label: 'Calculators', catKey: 'calculator' },
    { id: 'utility', label: 'Other Useful Tools', catKey: 'utility' },
  ];

  const handleToolClick = (slug: string) => {
    onNavigate(`/tools/${slug}`);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName || 'Unmokto',
    url: window.location.origin,
    description: seo.homepageMetaDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="min-h-screen">
      <MetaManager
        title={seo.homepageTitle}
        description={seo.homepageMetaDescription}
        canonicalPath="/"
        schema={schema}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/50 pt-16 pb-20 dark:border-slate-800/80 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-950 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] dark:opacity-[0.15] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>100% Free Online Tools • No Sign Up • Zero Limits</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Free Online Tools for{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
              Everyday Tasks
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            Compress images, convert files, create QR codes, calculate, edit text and more — completely free with zero registration.
          </p>

          {/* Large Search Box */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center shadow-lg shadow-slate-200/60 dark:shadow-none rounded-2xl">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a tool (e.g. compress image, pdf to jpg, qr code, bmi)..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-500/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placement: Homepage Top */}
      <div className="mx-auto max-w-5xl px-4">
        <AdSlot placementKey="homepage_top" />
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* If user is searching or filtered */}
        {searchQuery ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Search Results ({filteredTools.length})
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                Reset search
              </button>
            </div>

            {filteredTools.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <Search className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 text-lg font-bold text-slate-800 dark:text-white">
                  No tools found for "{searchQuery}"
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try searching with different keywords like "image", "pdf", "convert", or "compress".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} onClick={() => handleToolClick(t.slug)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {/* Section: Popular Tools */}
            {activeCategory === 'all' && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Popular Tools
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigate('/tools')}
                    className="group flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
                  >
                    <span>View All Tools</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {popularTools.map((t) => (
                    <ToolCard key={t.slug} tool={t} onClick={() => handleToolClick(t.slug)} />
                  ))}
                </div>
              </section>
            )}

            {/* Ad Placement: Homepage Middle */}
            <AdSlot placementKey="homepage_middle" />

            {/* Categorized Sections */}
            {categories
              .filter((c) => c.catKey && (activeCategory === 'all' || activeCategory === c.id))
              .map((c) => {
                const categoryTools = tools.filter(
                  (t) => t.category === c.catKey && t.enabled
                );
                if (categoryTools.length === 0) return null;

                return (
                  <section key={c.id}>
                    <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {c.label}
                      </h2>
                      <button
                        onClick={() => onNavigate(`/category/${c.catKey}`)}
                        className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                      >
                        Explore category &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {categoryTools.map((t) => (
                        <ToolCard key={t.slug} tool={t} onClick={() => handleToolClick(t.slug)} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        )}

        {/* Ad Placement: Native Banner */}
        <AdSlot placementKey="native_banner" />

        {/* Value Proposition / Privacy Highlights */}
        <section className="mt-20 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-8 sm:p-12 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Millions Rely on Unmokto
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Modern online utilities engineered for speed, privacy, and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                100% Client-Side Privacy
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Your images, documents, and videos are processed directly in your web browser using HTML5 Canvas and WebAssembly. Your files are never uploaded to remote servers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Zero Registration Needed
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No forms, no credit cards, no logins, and no subscriptions. Open any tool and start working immediately without delays or annoying paywalls.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Instant Processing Speed
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No network upload delays. By taking advantage of your device’s local processor, files compress, resize, and convert in a fraction of a second.
              </p>
            </div>
          </div>
        </section>

        {/* Native Recommendation Banner Slot */}
        <div className="mt-12">
          <AdSlot placementKey="native_banner" />
        </div>

        {/* Global FAQ Section */}
        <section className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Common questions about Unmokto online tools and privacy.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Are Unmokto online tools really 100% free?',
                a: 'Yes, every single tool on Unmokto is completely free to use. There are no subscriptions, no hidden limits, and no credit card requirements.',
              },
              {
                q: 'Do I need to register or create an account to use the tools?',
                a: 'Never! We believe in fast and barrier-free access. You do not need to create an account, register, or provide an email address.',
              },
              {
                q: 'How does Unmokto protect my privacy?',
                a: 'Unlike traditional websites that upload your files to remote cloud servers, Unmokto processes images, PDFs, videos, and calculations locally inside your browser using JavaScript and HTML5 APIs.',
              },
              {
                q: 'Can I use Unmokto on my smartphone or tablet?',
                a: 'Yes! Unmokto is fully responsive and optimized for mobile devices, tablets, laptops, and desktop computers.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer text-base font-bold text-slate-900 dark:text-white">
                  <span>{faq.q}</span>
                  <span className="ml-4 shrink-0 rounded-full p-1 text-slate-400 group-open:rotate-180 transition-transform">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 pt-3 dark:border-slate-800">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Ad Placement: Homepage Bottom */}
        <div className="mt-12">
          <AdSlot placementKey="homepage_bottom" />
        </div>
      </main>
    </div>
  );
};

interface ToolCardProps {
  tool: ToolConfig;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-500/50 hover:-translate-y-1 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <ToolIcon name={tool.icon} className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase tracking-wider">
            {tool.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Use Now
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] text-slate-400">100% Free</span>
      </div>
    </div>
  );
};
