import React, { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Key, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_LIST = [
  'amber', 'brave', 'coral', 'delta', 'eagle', 'flame', 'glide', 'haven', 'ivory', 'jewel',
  'karma', 'lemon', 'magic', 'noble', 'ocean', 'prism', 'quest', 'river', 'solar', 'tiger',
  'ultra', 'vivid', 'wave', 'xenon', 'yield', 'zenith', 'alpine', 'breeze', 'cloud', 'dawn'
];

export const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(4);

  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = () => {
    let result = '';

    if (mode === 'passphrase') {
      const words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        const randIndex = Math.floor(Math.random() * WORD_LIST.length);
        words.push(WORD_LIST[randIndex]);
      }
      result = words.join('-');
      if (useNumbers) {
        result += Math.floor(Math.random() * 90 + 10);
      }
    } else {
      let chars = '';
      if (useLower) chars += avoidAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
      if (useUpper) chars += avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useNumbers) chars += avoidAmbiguous ? '23456789' : '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

      // Use window.crypto for cryptographically strong random values
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    }

    setPassword(result);
    setHistory((prev) => [result, ...prev.filter((p) => p !== result)].slice(0, 5));
  };

  useEffect(() => {
    generate();
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous, wordCount]);

  const copyToClipboard = (txt?: string) => {
    const textToCopy = txt || password;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
  };

  // Evaluate password strength
  const getStrength = (pwd: string) => {
    if (!pwd) return { label: 'Empty', color: 'bg-slate-300', percent: 0, time: 'Instant' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 2;
    if (pwd.length >= 24) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score < 4) {
      return { label: 'Weak', color: 'bg-rose-500', percent: 25, time: 'A few minutes' };
    } else if (score < 6) {
      return { label: 'Moderate', color: 'bg-amber-500', percent: 50, time: 'Several days' };
    } else if (score < 8) {
      return { label: 'Strong', color: 'bg-emerald-500', percent: 75, time: 'Decades' };
    } else {
      return { label: 'Very Strong', color: 'bg-teal-500', percent: 100, time: 'Billions of years' };
    }
  };

  const strength = getStrength(password);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Generated Display Box */}
      <div className="relative flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60 mb-6">
        <span className="font-mono text-base sm:text-xl font-bold tracking-wider text-slate-900 dark:text-white break-all select-all">
          {password}
        </span>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <button
            onClick={() => generate()}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => copyToClipboard()}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 active:scale-95 cursor-pointer transition-all"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Strength indicator */}
      <div className="mb-6 space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Password Strength: <strong className="text-slate-900 dark:text-white">{strength.label}</strong></span>
          <span>Estimated crack time: <strong>{strength.time}</strong></span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${strength.percent}%` }}
          />
        </div>
      </div>

      {/* Mode Switch */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('random')}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            mode === 'random'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Random Characters
        </button>
        <button
          onClick={() => setMode('passphrase')}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            mode === 'passphrase'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Memorable Passphrase
        </button>
      </div>

      {/* Settings based on mode */}
      {mode === 'random' ? (
        <div className="space-y-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Password Length</span>
              <span className="font-mono text-emerald-600 font-bold">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Uppercase (A-Z)', val: useUpper, set: setUseUpper },
              { label: 'Lowercase (a-z)', val: useLower, set: setUseLower },
              { label: 'Numbers (0-9)', val: useNumbers, set: setUseNumbers },
              { label: 'Symbols (!@#$)', val: useSymbols, set: setUseSymbols },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.val}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={avoidAmbiguous}
                onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              Avoid ambiguous characters (e.g. 1, l, I, 0, O)
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Number of Words</span>
              <span className="font-mono text-emerald-600 font-bold">{wordCount} words</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            Append random numbers at the end
          </label>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Recently Generated
          </span>
          <div className="space-y-1.5">
            {history.slice(1).map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs sm:max-w-md">{h}</span>
                <button
                  onClick={() => copyToClipboard(h)}
                  className="text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
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
