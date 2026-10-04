import React from 'react';
import { useApp } from '../context/AppContext';
import { MetaManager } from '../components/seo/MetaManager';

export const TermsOfServicePage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={`Terms of Service – ${settings.siteName || 'Unmokto'}`}
        description="Terms of Service for Unmokto free online tools."
        canonicalPath="/terms-of-service"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mb-8">Last Updated: October 2026</p>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using {settings.siteName || 'Unmokto'} ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the services provided.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. Permitted Use
            </h2>
            <p>
              The Service is provided free of charge for both personal and commercial utility tasks. You agree to use the Service in compliance with all applicable local, national, and international laws and regulations.
            </p>
            <p className="mt-2">
              You must not use the tools to process malicious software, viruses, or defamatory materials, nor attempt to disrupt the availability of the website for other users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Intellectual Property Rights
            </h2>
            <p>
              You retain 100% full ownership, rights, and copyright to all files, images, documents, and content you process using the tools. {settings.siteName || 'Unmokto'} claims no ownership or license over your content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. We do not warrant that calculations, image outputs, or file conversions will be error-free or uninterrupted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Modifications to the Service
            </h2>
            <p>
              We reserve the right to modify, enhance, or discontinue any tool or feature at any time without prior notice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
