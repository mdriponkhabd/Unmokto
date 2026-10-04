import React, { useState } from 'react';
import { Youtube, Download, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ThumbnailOption {
  label: string;
  res: string;
  url: string;
}

export const YoutubeThumbnailDownloader: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [videoId, setVideoId] = useState<string>('dQw4w9WgXcQ');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const extractVideoId = (url: string): string | null => {
    const cleaned = url.trim();
    // Raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
      return cleaned;
    }
    // Standard youtube.com/watch?v=ID
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = cleaned.match(regExp);
    return match ? match[1] : null;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (!id) {
      alert('Could not find a valid YouTube video ID from the provided link.');
      return;
    }
    setVideoId(id);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
  };

  const thumbnails: ThumbnailOption[] = videoId
    ? [
        {
          label: 'Maximum Resolution (Full HD 1080p)',
          res: '1920 × 1080',
          url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        },
        {
          label: 'High Quality (HD 720p)',
          res: '1280 × 720',
          url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        },
        {
          label: 'Standard Definition (SD)',
          res: '640 × 480',
          url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        },
        {
          label: 'Medium Quality (MQ)',
          res: '320 × 180',
          url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        },
      ]
    : [];

  const handleDownload = async (imgUrl: string, label: string) => {
    try {
      // In browser, fetching cross-origin image through canvas or blob
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `yt_thumbnail_${videoId}_${label.split(' ')[0]}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // Direct link fallback
      window.open(imgUrl, '_blank');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube Video or Shorts URL (e.g. https://www.youtube.com/watch?v=...)"
            className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <Youtube className="absolute left-3.5 top-3.5 h-4 w-4 text-red-500" />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer transition-all"
        >
          Get Thumbnails
        </button>
      </form>

      {thumbnails.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {thumbnails.map((item) => (
              <div
                key={item.label}
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col"
              >
                <div className="relative aspect-video bg-black/10 dark:bg-black/40 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.label}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback if maxres is unavailable for this video
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-mono text-white">
                    {item.res}
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </h4>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.url)}
                      className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                    >
                      {copiedUrl === item.url ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedUrl === item.url ? 'Copied' : 'Copy URL'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(item.url, item.label)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/20 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Disclaimer: This utility retrieves publicly indexed thumbnail images from YouTube content delivery servers. Unmokto respects creators rights and does not host or store copyrighted video content.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
