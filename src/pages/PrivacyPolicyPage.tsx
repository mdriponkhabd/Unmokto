import React from 'react';
import { useApp } from '../context/AppContext';
import { MetaManager } from '../components/seo/MetaManager';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen py-12">
      <MetaManager
        title={`Privacy Policy – ${settings.siteName || 'Unmokto'}`}
        description="Privacy Policy for Unmokto. Learn how we handle your files with 100% client-side browser processing and zero server retention."
        canonicalPath="/privacy-policy"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8">Effective Date: October 2026</p>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Our Client-Side Architecture
            </h2>
            <p>
              At {settings.siteName || 'Unmokto'}, protecting your privacy is our primary engineering principle. Unlike conventional file conversion services that transfer user documents and photos to remote servers, our image, PDF, text, and video tools execute entirely within your local browser sandbox via JavaScript, HTML5 Canvas, and WebAssembly.
            </p>
            <p className="mt-2 font-semibold text-emerald-700 dark:text-emerald-400">
              Your files, images, PDFs, and entered texts are never transmitted or stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. No User Registration or Account Data
            </h2>
            <p>
              {settings.siteName || 'Unmokto'} does not require user registration, passwords, phone numbers, or credit card details. Visitors can use every tool immediately without providing any personal identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. Cookies and Advertising Partners
            </h2>
            <p>
              To maintain our tools as a free public service, we collaborate with reputable advertising networks such as Adsterra. These third-party ad vendors may use cookies, web beacons, or device identifiers to serve advertisements based on prior visits to this or other websites.
            </p>
            <p className="mt-2">
              You can manage or disable cookies at any time via your browser settings or privacy extensions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Analytics & Performance
            </h2>
            <p>
              We may utilize aggregated, privacy-conscious analytics (such as Google Analytics) to monitor website traffic, popular tool usage frequencies, and technical reliability. No personal file data or uploaded content is ever associated with analytics events.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at {settings.contactEmail || 'contact@unmokto.com'}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
