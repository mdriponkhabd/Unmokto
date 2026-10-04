import React, { useState, useEffect } from 'react';
import { Search, Save, Check, Globe, FileCode, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SeoSettings } from '../../types';

export const AdminSeoManager: React.FC = () => {
  const { seo, adminToken, refreshData } = useApp();
  const [formData, setFormData] = useState<SeoSettings>(seo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (seo) setFormData(seo);
  }, [seo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update SEO settings');
      await refreshData();
      setSaveStatus('SEO settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving SEO');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">SEO &amp; Indexing Manager</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Configure homepage metadata, OpenGraph cards, search engine robots.txt, and custom tracking headers.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : saveStatus ? (
            <>
              <Check className="h-4 w-4" />
              <span>{saveStatus}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save SEO Settings</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Homepage SEO */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Homepage Search Metadata
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Homepage Title Tag</span>
              <span className="text-slate-500">{formData.homepageTitle?.length || 0} / 60 chars</span>
            </div>
            <input
              type="text"
              required
              value={formData.homepageTitle || ''}
              onChange={(e) => setFormData({ ...formData, homepageTitle: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Homepage Meta Description</span>
              <span className="text-slate-500">{formData.homepageMetaDescription?.length || 0} / 160 chars</span>
            </div>
            <textarea
              rows={3}
              required
              value={formData.homepageMetaDescription || ''}
              onChange={(e) => setFormData({ ...formData, homepageMetaDescription: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Default Social Share OG Image URL
            </label>
            <input
              type="url"
              value={formData.ogImage || ''}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              placeholder="https://unmokto.com/og-banner.png"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Search Engine Robots & Crawling */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Robots.txt Configuration
            </h3>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline"
            >
              View Live /robots.txt
            </a>
          </div>

          <p className="text-xs text-slate-400">
            Defines which paths web crawlers (Googlebot, Bingbot) can index. The admin portal is disarmed by default.
          </p>

          <textarea
            rows={5}
            value={formData.robotsSettings || ''}
            onChange={(e) => setFormData({ ...formData, robotsSettings: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-200"
          />
        </div>

        {/* Custom Header & Footer Scripts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Custom Header &amp; Tracking Scripts
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom &lt;head&gt; Scripts (e.g. meta tags, domain verification)
            </label>
            <textarea
              rows={4}
              value={formData.customHeaderScripts || ''}
              onChange={(e) => setFormData({ ...formData, customHeaderScripts: e.target.value })}
              placeholder="<meta name='google-site-verification' content='...' />"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Custom &lt;body&gt; Footer Scripts
            </label>
            <textarea
              rows={4}
              value={formData.customFooterScripts || ''}
              onChange={(e) => setFormData({ ...formData, customFooterScripts: e.target.value })}
              placeholder="<script> ... </script>"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 font-mono text-xs text-slate-200"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
