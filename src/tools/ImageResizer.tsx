import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Lock, Unlock, Maximize2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<string>('image/png');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setFile(selectedFile);
    setResultUrl(null);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((val * origHeight) / origWidth));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((val * origWidth) / origHeight));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };

  const handleResize = async () => {
    if (!file || !previewUrl || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((res) => {
        canvas.toBlob(res, format, 0.92);
      });

      if (!blob) throw new Error('Resize failed');

      setResultSize(blob.size);
      const resUrl = URL.createObjectURL(blob);
      setResultUrl(resUrl);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
      alert('Error resizing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `resized_${width}x${height}_${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setOrigWidth(0);
    setOrigHeight(0);
    setWidth(0);
    setHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-10 text-center hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <Maximize2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Choose an image to resize
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or <span className="font-semibold text-emerald-600 dark:text-emerald-400">click to upload</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">Supports JPG, PNG, WebP • No size limits</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Common Resolution Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1920×1080 (FHD)', w: 1920, h: 1080 },
                { label: '1280×720 (HD)', w: 1280, h: 720 },
                { label: '1080×1080 (Square)', w: 1080, h: 1080 },
                { label: '1080×1920 (Story/Reel)', w: 1080, h: 1920 },
                { label: '800×600 (Standard)', w: 800, h: 600 },
                { label: '500×500 (Avatar)', w: 500, h: 500 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.w, p.h)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Width / Height / Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Width (pixels)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={width || ''}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Height (pixels)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={height || ''}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  lockAspect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {lockAspect ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                {lockAspect ? 'Aspect Locked' : 'Aspect Free'}
              </button>

              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-500 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Maximize2 className="h-4 w-4" />
              {isProcessing ? 'Resizing...' : 'Resize Image'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {resultUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    Resized Successfully ({width} × {height} px)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Original was {origWidth} × {origHeight} px
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Resized Image
                </button>
              </div>
              <div className="mt-4 max-h-72 overflow-hidden rounded-lg bg-slate-200/50 dark:bg-slate-950/50 flex items-center justify-center p-2">
                <img src={resultUrl} alt="Resized output" className="max-h-64 object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
