import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

export const AdminPages: React.FC = () => {
  const pagesList = [
    { title: 'Home', path: '/', desc: 'Primary landing page with search, categories, and popular tools' },
    { title: 'All Tools', path: '/tools', desc: 'Complete directory of all 18 online utilities' },
    { title: 'About Us', path: '/about', desc: 'Brand mission, client-side privacy architecture, and values' },
    { title: 'Contact', path: '/contact', desc: 'Visitor inquiries, suggestions, and feedback form' },
    { title: 'Privacy Policy', path: '/privacy-policy', desc: 'Explicit declaration of zero server retention and GDPR/CCPA info' },
    { title: 'Terms of Service', path: '/terms-of-service', desc: 'Acceptance terms, rights, and usage conditions' },
    { title: 'Disclaimer', path: '/disclaimer', desc: 'General educational and informational disclaimer' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white">Public Pages Manager</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Manage your static informational, contact, and compliance pages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pagesList.map((p) => (
          <div
            key={p.path}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <span className="font-mono text-xs text-slate-500">{p.path}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-semibold">Published &amp; Indexed</span>
              <a
                href={p.path}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white"
              >
                <span>View Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
