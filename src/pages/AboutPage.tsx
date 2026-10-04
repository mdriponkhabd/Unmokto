import React from 'react';
import { Zap, Shield, Heart, Users, Globe, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetaManager } from '../components/seo/MetaManager';
import { AdSlot } from '../components/ads/AdSlot';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={`About ${settings.siteName || 'Unmokto'} – Free Online Tools for Everyone`}
        description="Learn more about Unmokto, our mission to provide completely free, private, browser-based online tools with zero registration or paywalls."
        canonicalPath="/about"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 mb-3">
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            About {settings.siteName || 'Unmokto'}
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {settings.tagline || 'Free Online Tools for Everyone'} — Built with the fundamental conviction that essential digital utilities should be completely free, private, and accessible to anyone without subscriptions or sign-in friction.
          </p>
        </div>

        <AdSlot placementKey="tool_top" />

        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Why We Built Unmokto
            </h2>
            <p>
              Every day, millions of people search for simple tools: compressing a PDF before an email attachment limit, resizing a photo for a visa application, creating a QR code for a wedding, or counting words for an essay.
            </p>
            <p className="mt-3">
              Too often, modern web utilities are laden with mandatory account registrations, monthly paywalls, aggressive tracking scripts, and slow servers that upload your private documents to unknown cloud providers. Unmokto was created as an antidote to this frustration.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span>Privacy by Architecture</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All image compression, conversion, QR code generation, and PDF page extraction happens locally inside your browser using client-side JavaScript. Your files never leave your device.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                <span>Zero Account Friction</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You do not need to register, verify an email address, or provide credit card credentials. Every tool is ready to use the moment you open the page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              How We Sustain Unmokto
            </h2>
            <p>
              To keep our tools 100% free for everyone around the world, Unmokto is supported through tasteful, non-intrusive advertisements. We strictly ensure that ad placements never interfere with file upload zones, tool buttons, or user workflows.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigate('/tools')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
            >
              <span>Explore All Free Tools</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
