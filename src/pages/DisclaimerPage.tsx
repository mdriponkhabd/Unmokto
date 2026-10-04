import React from 'react';
import { useApp } from '../context/AppContext';
import { MetaManager } from '../components/seo/MetaManager';

export const DisclaimerPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={`Disclaimer – ${settings.siteName || 'Unmokto'}`}
        description="Disclaimer and limitation of liability statement for Unmokto free online utilities."
        canonicalPath="/disclaimer"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-400 mb-8">Last Updated: October 2026</p>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. General Information Only
            </h2>
            <p>
              The information and calculations provided on {settings.siteName || 'Unmokto'} (including the BMI Calculator and Age Calculator) are for general educational, productivity, and informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Not Medical or Professional Advice
            </h2>
            <p>
              Health estimation utilities such as the Body Mass Index (BMI) calculator and calorie estimates do not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician or healthcare provider regarding any medical condition or dietary changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Third-Party Links & Trademarks
            </h2>
            <p>
              YouTube™ is a trademark of Google LLC. The YouTube Thumbnail Downloader utility retrieves publicly indexed thumbnail images from YouTube's public content delivery servers. Unmokto is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. External Advertisements
            </h2>
            <p>
              Our website displays advertisements provided by third-party ad networks (e.g. Adsterra). Unmokto does not endorse, guarantee, or assume responsibility for products, services, or claims advertised in third-party promotional banners.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
