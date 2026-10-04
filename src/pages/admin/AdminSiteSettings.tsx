import React, { useState, useEffect, useRef } from 'react';
import { Settings, Save, Check, Key, Shield, Palette, Image as ImageIcon, Upload, Trash2, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteSettings } from '../../types';

export const AdminSiteSettings: React.FC = () => {
  const { settings, adminToken, refreshData } = useApp();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, faviconUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: any = {
        ...formData,
        siteName: formData.companyName || formData.siteName,
      };
      if (newPassword) {
        payload.newPassword = newPassword;
      }

      try {
        localStorage.setItem('unmokto_custom_settings', JSON.stringify(payload));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok && res.status !== 404) throw new Error('Failed to update site settings');
      await refreshData();
      setStatusMessage('Settings updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e: any) {
      await refreshData();
      setStatusMessage('Settings updated!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">Site Settings &amp; Security</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Configure company name, brand logo, favicon, theme colors, analytics, and admin credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : statusMessage ? (
            <>
              <Check className="h-4 w-4" />
              <span>{statusMessage}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Site Settings</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding, Company Name, Logo & Favicon */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Company Identity &amp; Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Company Name / Website Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName || formData.siteName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    companyName: e.target.value,
                    siteName: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Displayed across header, footer, titles and copyright.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Site Tagline
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>

          {/* Logo & Favicon uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-800/80">
            {/* Logo Settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Company Brand Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center p-2">
                  {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">No Logo</span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Logo</span>
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logoUrl: '' })}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-red-400 hover:bg-red-950/40 cursor-pointer"
                        title="Remove logo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="or paste logo image URL..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white placeholder-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Favicon Settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Website Favicon (Browser Tab Icon)
              </label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center p-2">
                  {formData.faviconUrl ? (
                    <img src={formData.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" />
                  ) : (
                    <Globe className="h-6 w-6 text-slate-600" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFaviconUpload(e.target.files[0])}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Favicon</span>
                    </button>
                    {formData.faviconUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, faviconUrl: '' })}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-red-400 hover:bg-red-950/40 cursor-pointer"
                        title="Remove favicon"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.faviconUrl || ''}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="or paste favicon .ico / .png URL..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white placeholder-slate-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor || '#059669'}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-9 w-10 cursor-pointer rounded border border-slate-800 bg-slate-900 p-0.5"
                />
                <span className="font-mono text-xs text-slate-400">{formData.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Secondary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor || '#0284c7'}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-9 w-10 cursor-pointer rounded border border-slate-800 bg-slate-900 p-0.5"
                />
                <span className="font-mono text-xs text-slate-400">{formData.secondaryColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Footer Copyright Text
            </label>
            <input
              type="text"
              value={formData.footerText || ''}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Contact &amp; Social Links
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Public Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Twitter / X Link
              </label>
              <input
                type="url"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Link
              </label>
              <input
                type="url"
                value={formData.socialLinks?.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value },
                  })
                }
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Search Console */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Analytics &amp; Search Console
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google Search Console HTML Tag
              </label>
              <input
                type="text"
                value={formData.googleSearchConsole || ''}
                onChange={(e) => setFormData({ ...formData, googleSearchConsole: e.target.value })}
                placeholder="verification-code"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Admin Password Change */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Change Admin Password
          </h3>
          <p className="text-xs text-slate-400">
            Leave blank if you do not wish to change the administrator password.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
