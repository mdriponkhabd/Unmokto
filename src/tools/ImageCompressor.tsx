import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Sparkles, Check, FileImage, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setResultBlob(null);
    setResultUrl(null);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompress = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (maxDimension > 0 && (width > maxDimension || height > maxDimension)) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // For JPEG fill white behind transparent PNGs
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, format, quality / 100);
      });

      if (!blob) throw new Error('Compression failed');

      setResultBlob(blob);
      setCompressedSize(blob.size);
      const resUrl = URL.createObjectURL(blob);
      setResultUrl(resUrl);

      // Trigger celebratory confetti if saved > 10%
      if (blob.size < originalSize) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while compressing the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = format === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `compressed_${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentSaved =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-10 text-center hover:bg-emerald-50 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Drag & Drop your image here
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            or <span className="font-semibold text-emerald-600 dark:text-emerald-400">Browse Files</span> from your device
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Supports JPG, PNG, WebP up to 50MB • 100% Client-side privacy
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Quality</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">70-80% recommended</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Max Dimension
              </label>
              <select
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={0}>Original Size</option>
                <option value={1920}>1920px (Full HD)</option>
                <option value={1280}>1280px (HD)</option>
                <option value={800}>800px (Web)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/webp">WebP (Smallest)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {isProcessing ? 'Compressing...' : 'Compress Image'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Result Card */}
          {resultUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-emerald-200 bg-white dark:border-emerald-800">
                    <img src={resultUrl} alt="Compressed preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Compression Complete!
                      </span>
                      <span className="rounded-full bg-emerald-500 text-white px-2 py-0.5 text-xs font-bold">
                        -{percentSaved}%
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span>Original: <strong className="text-slate-800 dark:text-slate-200">{formatBytes(originalSize)}</strong></span>
                      <span>•</span>
                      <span>Compressed: <strong className="text-emerald-700 dark:text-emerald-300">{formatBytes(compressedSize)}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 cursor-pointer active:scale-95 transition-transform"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </button>
              </div>
            </div>
          )}

          {/* Original Preview */}
          {previewUrl && !resultUrl && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Selected file: <strong>{file.name}</strong> ({formatBytes(originalSize)})</span>
              </div>
              <div className="max-h-80 overflow-hidden rounded-lg flex items-center justify-center bg-slate-200/50 dark:bg-slate-900/50">
                <img src={previewUrl} alt="Original preview" className="max-h-80 object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
