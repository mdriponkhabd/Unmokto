import React, { useState, useEffect } from 'react';
import { Wrench, Save, Check, ToggleLeft, ToggleRight, Search, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ToolConfig } from '../../types';
import { ToolIcon } from '../../components/common/ToolIcon';

export const AdminToolsManager: React.FC = () => {
  const { tools, adminToken, refreshData } = useApp();
  const [localTools, setLocalTools] = useState<Record<string, ToolConfig>>({});
  const [search, setSearch] = useState('');
  const [selectedToolSlug, setSelectedToolSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (tools && tools.length > 0) {
      const map: Record<string, ToolConfig> = {};
      tools.forEach((t) => {
        map[t.slug] = t;
      });
      setLocalTools(map);
      if (!selectedToolSlug && tools[0]) {
        setSelectedToolSlug(tools[0].slug);
      }
    }
  }, [tools]);

  const handleToggle = (slug: string) => {
    setLocalTools((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        enabled: !prev[slug].enabled,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/admin/tools', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(localTools),
      });

      if (!res.ok) throw new Error('Failed to update tools configuration');
      await refreshData();
      setSaveStatus('Tools updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Error saving tools');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTool = selectedToolSlug ? localTools[selectedToolSlug] : null;

  const filteredList = Object.values(localTools).filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Tools Manager &amp; Customization
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Enable or disable individual tools, update custom SEO page titles, meta descriptions, and keywords.
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
              <span>Save Tool Settings</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Tools */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1">
            {filteredList.map((t) => {
              const isSelected = selectedToolSlug === t.slug;
              return (
                <div
                  key={t.slug}
                  onClick={() => setSelectedToolSlug(t.slug)}
                  className={`flex items-center justify-between rounded-xl p-3 text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border border-emerald-500/50 bg-emerald-950/40 text-white'
                      : 'border border-transparent bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-emerald-400">
                      <ToolIcon name={t.icon} className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{t.category} • {t.usageCount || 0} uses</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(t.slug);
                    }}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      t.enabled ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {t.enabled ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Tool SEO & Meta Editor */}
        {currentTool && (
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{currentTool.name}</h3>
                <span className="font-mono text-xs text-slate-400">/tools/{currentTool.slug}</span>
              </div>
              <a
                href={`/tools/${currentTool.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
              >
                <span>Preview Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={currentTool.name}
                onChange={(e) =>
                  setLocalTools((prev) => ({
                    ...prev,
                    [currentTool.slug]: { ...prev[currentTool.slug], name: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={currentTool.shortDesc}
                onChange={(e) =>
                  setLocalTools((prev) => ({
                    ...prev,
                    [currentTool.slug]: { ...prev[currentTool.slug], shortDesc: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Page Description
              </label>
              <textarea
                rows={2}
                value={currentTool.fullDesc}
                onChange={(e) =>
                  setLocalTools((prev) => ({
                    ...prev,
                    [currentTool.slug]: { ...prev[currentTool.slug], fullDesc: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white"
              />
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                SEO &amp; OpenGraph Settings
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom SEO Title Tag
                </label>
                <input
                  type="text"
                  value={currentTool.seoTitle}
                  onChange={(e) =>
                    setLocalTools((prev) => ({
                      ...prev,
                      [currentTool.slug]: { ...prev[currentTool.slug], seoTitle: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Meta Description
                </label>
                <textarea
                  rows={2}
                  value={currentTool.seoDescription}
                  onChange={(e) =>
                    setLocalTools((prev) => ({
                      ...prev,
                      [currentTool.slug]: { ...prev[currentTool.slug], seoDescription: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={currentTool.focusKeyword}
                  onChange={(e) =>
                    setLocalTools((prev) => ({
                      ...prev,
                      [currentTool.slug]: { ...prev[currentTool.slug], focusKeyword: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
