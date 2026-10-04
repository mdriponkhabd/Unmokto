import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, Type } from 'lucide-react';

export const TextCaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('hello world from unmokto free online tools');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (converted: string, label: string) => {
    navigator.clipboard.writeText(converted);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  };

  const toPascalCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');
  };

  const converters = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: toTitleCase },
    { label: 'Sentence case', fn: toSentenceCase },
    { label: 'camelCase', fn: toCamelCase },
    { label: 'PascalCase', fn: toPascalCase },
    { label: 'snake_case', fn: toSnakeCase },
    { label: 'kebab-case', fn: toKebabCase },
    { label: 'CONSTANT_CASE', fn: toConstantCase },
    { label: 'aLtErNaTiNg', fn: toAlternatingCase },
  ];

  const handleApplyToInput = (converted: string) => {
    setText(converted);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Enter or Paste Text
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert..."
          className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <div className="mt-6">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Instant Case Conversions (Click to Copy or Apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {converters.map((item) => {
            const result = item.fn(text);
            const isCopied = copied === item.label;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="overflow-hidden pr-3">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    {item.label}
                  </span>
                  <p className="mt-0.5 text-sm font-mono text-slate-800 dark:text-slate-200 truncate">
                    {result || '...'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleApplyToInput(result)}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                    title="Replace input with this"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => copyToClipboard(result, item.label)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-500 cursor-pointer"
                  >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
