import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<string>('free'); // 'free' | '1:1' | '16:9' | '4:3' | '9:16'
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Crop box normalized coordinates (0 to 1)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.1,
    y: 0.1,
    w: 0.8,
    h: 0.8,
  });

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  };

  const handleAspectChange = (newAspect: string) => {
    setAspect(newAspect);
    if (newAspect === '1:1') {
      setCropBox({ x: 0.15, y: 0.15, w: 0.7, h: 0.7 });
    } else if (newAspect === '16:9') {
      setCropBox({ x: 0.05, y: 0.2, w: 0.9, h: (0.9 * 9) / 16 });
    } else if (newAspect === '4:3') {
      setCropBox({ x: 0.1, y: 0.15, w: 0.8, h: (0.8 * 3) / 4 });
    } else if (newAspect === '9:16') {
      setCropBox({ x: 0.25, y: 0.05, w: 0.5, h: (0.5 * 16) / 9 });
    } else {
      setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
    }
  };

  const executeCrop = async () => {
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
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      const cropX = Math.round(cropBox.x * naturalW);
      const cropY = Math.round(cropBox.y * naturalH);
      const cropW = Math.max(10, Math.round(cropBox.w * naturalW));
      const cropH = Math.max(10, Math.round(cropBox.h * naturalH));

      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Transformations
      ctx.save();
      ctx.translate(cropW / 2, cropH / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.scale(zoom, zoom);
      ctx.translate(-cropW / 2, -cropH / 2);

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      ctx.restore();

      const blob = await new Promise<Blob | null>((res) => {
        canvas.toBlob(res, 'image/png');
      });

      if (!blob) throw new Error('Cropping failed');
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
      alert('Error cropping image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `cropped_${base}.png`;
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
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <Crop className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Choose an image to crop
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or <span className="font-semibold text-emerald-600 dark:text-emerald-400">browse files</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">Presets for Instagram, YouTube, Facebook, and custom crops</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'free', label: 'Free' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9' },
                  { id: '4:3', label: '4:3' },
                  { id: '9:16', label: '9:16' },
                ].map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleAspectChange(a.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                      aspect === a.id
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                <span>Zoom</span>
                <span className="font-mono text-emerald-600 font-bold">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Transform buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Rotate & Flip
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90) % 360)}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  title="Rotate -90°"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                  title="Rotate +90°"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`rounded-lg border p-2 cursor-pointer ${
                    flipH ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-700'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`rounded-lg border p-2 cursor-pointer ${
                    flipV ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-white text-slate-700'
                  }`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={executeCrop}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
            >
              <Crop className="h-4 w-4" />
              {isProcessing ? 'Cropping...' : 'Apply Crop'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Interactive Visual Frame */}
          <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 flex items-center justify-center min-h-[320px]">
            {previewUrl && (
              <div className="relative inline-block overflow-hidden max-h-[400px]">
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Crop Target"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="max-h-[380px] w-auto object-contain block mx-auto pointer-events-none"
                />

                {/* Crop Box Overlay */}
                <div
                  className="absolute border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none"
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.w * 100}%`,
                    height: `${cropBox.h * 100}%`,
                  }}
                >
                  <div className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white">
                    {aspect.toUpperCase()} Frame
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Result Card */}
          {resultUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    Cropped Image Ready
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Exported in high-quality PNG format
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Cropped Image
                </button>
              </div>

              <div className="mt-4 max-h-72 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-2">
                <img src={resultUrl} alt="Cropped output" className="max-h-64 object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
