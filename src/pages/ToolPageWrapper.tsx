import React, { useEffect } from 'react';
import { ChevronRight, ArrowRight, ShieldCheck, CheckCircle2, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOOL_GUIDES } from '../data/toolsData';
import { ToolRenderer } from '../tools/ToolRenderer';
import { ToolIcon } from '../components/common/ToolIcon';
import { AdSlot } from '../components/ads/AdSlot';
import { MetaManager } from '../components/seo/MetaManager';

interface ToolPageWrapperProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({ slug, onNavigate }) => {
  const { tools, settings, recordToolUsage } = useApp();

  const tool = tools.find((t) => t.slug === slug);
  const guide = TOOL_GUIDES[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slug) {
      recordToolUsage(slug);
    }
  }, [slug]);

  if (!tool) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tool Not Found</h1>
        <p className="mt-2 text-slate-500">The tool you are looking for does not exist or has been moved.</p>
        <button
          onClick={() => onNavigate('/')}
          className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Related tools from the same category
  const relatedTools = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug && t.enabled)
    .slice(0, 3);

  // SEO schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'All',
    applicationCategory: 'UtilitiesApplication',
    url: `${window.location.origin}/tools/${tool.slug}`,
    description: tool.seoDescription || tool.shortDesc,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(guide?.faqs && {
      mainEntity: guide.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    }),
  };

  return (
    <div className="min-h-screen py-8">
      <MetaManager
        title={tool.seoTitle || tool.name}
        description={tool.seoDescription || tool.shortDesc}
        canonicalPath={`/tools/${tool.slug}`}
        schema={schema}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-6">
          <button onClick={() => onNavigate('/')} className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Home
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <button
            onClick={() => onNavigate(`/category/${tool.category}`)}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 capitalize"
          >
            {tool.category} Tools
          </button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-800 dark:text-white font-semibold truncate">{tool.name}</span>
        </nav>

        {/* Ad Placement: Tool Top */}
        <AdSlot placementKey="tool_top" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Working Tool Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Block */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ToolIcon name={tool.icon} className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {tool.name}
                  </h1>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 capitalize">
                    Free Online {tool.category} Tool
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tool.fullDesc || tool.shortDesc}
              </p>

              {/* Privacy pill */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>100% Client-Side Privacy: Your files are processed locally in your browser.</span>
              </div>
            </div>

            {/* Main Interactive Tool */}
            <div>
              <ToolRenderer slug={tool.slug} />
            </div>

            {/* Ad Placement: Between Content */}
            <AdSlot placementKey="tool_middle" />

            {/* Step-by-Step Instructions */}
            {guide?.howToSteps && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    How to Use {tool.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.howToSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* In-Depth Educational SEO Content */}
            {guide?.seoArticle && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {guide.seoArticle.heading}
                </h2>
                {guide.seoArticle.paragraphs.map((para, i) => (
                  <p key={i} className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {para}
                  </p>
                ))}

                {/* Ad Placement: In-Article */}
                <AdSlot placementKey="in_article" />

                {guide.seoArticle.tips && guide.seoArticle.tips.length > 0 && (
                  <div className="mt-4 rounded-xl bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2">
                      Pro Tips & Best Practices
                    </h3>
                    <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                      {guide.seoArticle.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Tool FAQ Accordion */}
            {guide?.faqs && guide.faqs.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {guide.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40 [&_summary::-webkit-details-marker]:hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer text-sm font-bold text-slate-900 dark:text-white">
                        <span>{faq.question}</span>
                        <span className="ml-4 shrink-0 rounded-full p-1 text-slate-400 group-open:rotate-180 transition-transform">
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </summary>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Ad Placement: Tool Bottom */}
            <AdSlot placementKey="tool_bottom" />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Desktop Sidebar Ad */}
            <div className="hidden lg:block">
              <AdSlot placementKey="sidebar_desktop" />
            </div>

            {/* Related Tools Card */}
            {relatedTools.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Related {tool.category} Tools
                </h3>
                <div className="space-y-3">
                  {relatedTools.map((rel) => (
                    <button
                      key={rel.slug}
                      onClick={() => onNavigate(`/tools/${rel.slug}`)}
                      className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <ToolIcon name={rel.icon} className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                            {rel.name}
                          </p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {rel.shortDesc}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Benefits Card */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 p-5 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Unmokto Advantages
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Always 100% free with no limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No login or personal data collected</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>High-speed client-side execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Optimized for desktop and mobile</span>
                </li>
              </ul>
            </div>

            {/* Native Recommendation Banner */}
            <AdSlot placementKey="native_banner" />
          </div>
        </div>
      </div>
    </div>
  );
};
