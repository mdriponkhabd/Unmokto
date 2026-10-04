import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileImage, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JpgToPng: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);
  };

  const convertToPng = async () => {
    if (!previewUrl || !file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob | null>((res) => {
        canvas.toBlob(res, 'image/png');
      });

      if (!blob) throw new Error('Conversion failed');
      const pngUrl = URL.createObjectURL(blob);
      setResultUrl(pngUrl);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
      alert('Failed to convert JPG to PNG');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
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
            accept=".jpg,.jpeg,image/jpeg"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <FileImage className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Upload JPG or JPEG image
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or <span className="font-semibold text-emerald-600 dark:text-emerald-400">browse files</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">Instant lossless conversion to PNG</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={convertToPng}
                disabled={isProcessing}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
              >
                {isProcessing ? 'Converting...' : 'Convert to PNG'}
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {resultUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600" />
                  PNG Conversion Ready!
                </span>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download PNG
                </button>
              </div>
              <div className="mt-4 max-h-72 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2">
                <img src={resultUrl} alt="Converted PNG" className="max-h-64 object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
