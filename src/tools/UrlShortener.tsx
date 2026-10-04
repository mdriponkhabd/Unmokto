import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Link2, Copy, Check, ExternalLink, QrCode as QrIcon, Trash2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShortItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  createdAt: string;
}

export const UrlShortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState<string>('');
  const [customAlias, setCustomAlias] = useState<string>('');
  const [currentShort, setCurrentShort] = useState<ShortItem | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<ShortItem[]>(() => {
    try {
      const saved = localStorage.getItem('unmokto_short_urls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    let target = longUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    const slug = customAlias.trim()
      ? customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
      : Math.random().toString(36).substring(2, 8);

    const shortUrl = `https://unmokto.link/${slug}`;

    const newItem: ShortItem = {
      id: Math.random().toString(36).substring(7),
      originalUrl: target,
      shortUrl,
      slug,
      createdAt: new Date().toLocaleDateString(),
    };

    setCurrentShort(newItem);
    const updated = [newItem, ...history.filter((h) => h.slug !== slug)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem('unmokto_short_urls', JSON.stringify(updated));

    // Generate QR
    QRCode.toDataURL(target, { width: 250, margin: 2 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('unmokto_short_urls');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <form onSubmit={handleShorten} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Destination Long URL
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very/long/complex/url?with=tracking&params=123"
              className="w-full rounded-xl border border-slate-300 bg-white pl-4 pr-10 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <Link2 className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Custom Alias (Optional)
            </label>
            <div className="flex items-center">
              <span className="rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-3 py-2 text-xs font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                unmokto.link/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-cool-link"
                className="w-full rounded-r-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="sm:self-end">
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer transition-all"
            >
              Shorten URL
            </button>
          </div>
        </div>
      </form>

      {/* Result Card */}
      {currentShort && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Short URL Ready
              </span>
              <p className="font-mono text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {currentShort.shortUrl}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                Points to: {currentShort.originalUrl}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2 justify-center md:justify-start">
                <button
                  onClick={() => handleCopy(currentShort.shortUrl)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy Short Link'}
                </button>
                <a
                  href={currentShort.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit Destination
                </a>
              </div>
            </div>

            {qrDataUrl && (
              <div className="flex flex-col items-center">
                <div className="rounded-xl border border-white bg-white p-2 shadow-sm dark:border-slate-700">
                  <img src={qrDataUrl} alt="QR Code" className="h-28 w-28 object-contain" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Scan to open URL</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Shortened Links
            </span>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="overflow-hidden pr-3">
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.shortUrl}
                  </p>
                  <p className="text-slate-500 truncate mt-0.5">{item.originalUrl}</p>
                </div>
                <button
                  onClick={() => handleCopy(item.shortUrl)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
