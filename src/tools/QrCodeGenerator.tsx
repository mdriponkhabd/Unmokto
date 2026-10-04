import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, Wifi, Globe, Type, Mail, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QrCodeGenerator: React.FC = () => {
  const [mode, setMode] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone'>('url');
  const [content, setContent] = useState<string>('https://unmokto.com');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPassword, setWifiPassword] = useState<string>('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailBody, setEmailBody] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = (): string => {
    switch (mode) {
      case 'url':
      case 'text':
        return content.trim() || 'https://unmokto.com';
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      default:
        return content;
    }
  };

  useEffect(() => {
    const payload = getPayload();
    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: ecLevel,
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => console.error(err));
  }, [mode, content, wifiSsid, wifiPassword, wifiAuth, emailTo, emailSubject, emailBody, phoneNumber, fgColor, bgColor, ecLevel]);

  const handleDownload = (type: 'png' | 'svg') => {
    const payload = getPayload();
    if (type === 'png') {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `qrcode_unmokto.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      QRCode.toString(payload, {
        type: 'svg',
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      }).then((svgString) => {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode_unmokto.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback text copy
      navigator.clipboard.writeText(getPayload());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'url', label: 'Website URL', icon: Globe },
              { id: 'text', label: 'Plain Text', icon: Type },
              { id: 'wifi', label: 'WiFi Network', icon: Wifi },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'phone', label: 'Phone', icon: Phone },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    mode === m.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Form based on mode */}
          {mode === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Enter Website URL
              </label>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}

          {mode === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Enter Plain Text
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or paste your text message..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}

          {mode === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeWiFi"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="WiFi Password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Security Type
                </label>
                <select
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="WPA">WPA/WPA2 (Most common)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Hello there!"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          {mode === 'phone' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          )}

          {/* Color & Error Correction Customization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                QR Color (Dark)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                />
                <span className="font-mono text-xs text-slate-500">{fgColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Background (Light)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
                />
                <span className="font-mono text-xs text-slate-500">{bgColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Error Correction
              </label>
              <select
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="L">L (7% recovery)</option>
                <option value="M">M (15% - Default)</option>
                <option value="Q">Q (25% recovery)</option>
                <option value="H">H (30% High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/20">
          <div className="overflow-hidden rounded-2xl border-4 border-white bg-white p-3 shadow-md dark:border-slate-700">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR code" className="h-56 w-56 object-contain" />
            ) : (
              <div className="h-56 w-56 flex items-center justify-center text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-400">Point your smartphone camera to scan</p>

          <div className="mt-5 flex flex-wrap gap-2 w-full justify-center">
            <button
              onClick={() => handleDownload('png')}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              SVG Vector
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
