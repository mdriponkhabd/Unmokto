import React, { useState } from 'react';
import { Copy, Check, Trash2, FileText, Download, Sparkles } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const trimmed = text.trim();
  const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = wordsArray.length;
  const charWithSpaces = text.length;
  const charWithoutSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed]).length : 0;
  const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  const readingTimeMin = Math.ceil(wordCount / 200);
  const speakingTimeMin = Math.ceil(wordCount / 130);

  // Keyword density
  const getKeywordDensity = () => {
    if (wordsArray.length === 0) return [];
    const stopWords = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'that', 'is', 'for', 'it', 'on', 'with', 'as', 'this', 'was', 'at', 'by', 'an', 'be', 'from', 'or', 'are', 'your', 'you']);
    const frequency: Record<string, number> = {};

    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequency[clean] = (frequency[clean] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / wordsArray.length) * 100).toFixed(1),
      }));
  };

  const topKeywords = getKeywordDensity();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unmokto_document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const insertSample = () => {
    setText(
      'Unmokto is an ultra-fast, modern suite of free online utilities built for developers, students, writers, and digital professionals. Every tool operates directly inside your web browser with 100% privacy, meaning your documents, photos, and files are never stored or exposed to external servers. You can compress images, convert file formats, generate QR codes, calculate health metrics, and edit text seamlessly.'
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Words', val: wordCount, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Characters', val: charWithSpaces, color: 'text-sky-600 dark:text-sky-400' },
          { label: 'No Spaces', val: charWithoutSpaces, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Sentences', val: sentences, color: 'text-violet-600 dark:text-violet-400' },
          { label: 'Paragraphs', val: paragraphs, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Read Time', val: `~${readingTimeMin} min`, color: 'text-rose-600 dark:text-rose-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40"
          >
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <p className={`text-xl font-extrabold ${stat.color} mt-0.5`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here to analyze..."
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-base text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white transition-colors"
        />
      </div>

      {/* Controls & Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={insertSample}
            className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
          >
            Insert Sample Text
          </button>
          <button
            onClick={() => setText('')}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied Text' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Export .txt
          </button>
        </div>
      </div>

      {/* Keyword Density Breakdown */}
      {topKeywords.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Top Keyword Frequency & Density
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {topKeywords.map((k) => (
              <div
                key={k.word}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{k.word}</span>
                <span className="text-slate-500 font-mono">
                  {k.count}x ({k.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
