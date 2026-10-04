import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RefreshCw,
  Eraser,
  Pipette,
  Check,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type PreviewBg = 'checkerboard' | 'white' | 'black' | 'blue';

export const BackgroundRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState<number>(32);
  const [feather, setFeather] = useState<number>(8);
  const [mode, setMode] = useState<'flood' | 'global'>('flood');
  const [previewBg, setPreviewBg] = useState<PreviewBg>('checkerboard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transparentDataUrl, setTransparentDataUrl] = useState<string | null>(null);
  const [pickingColor, setPickingColor] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically detect the dominant background color from the outer borders
  const sampleDominantBorderColor = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): { r: number; g: number; b: number } => {
    const samples: Array<[number, number]> = [];

    // Corners
    samples.push([2, 2]);
    samples.push([width - 3, 2]);
    samples.push([2, height - 3]);
    samples.push([width - 3, height - 3]);

    // Border samples (every 3% along edges)
    for (let p = 0.05; p < 0.98; p += 0.03) {
      samples.push([Math.floor(width * p), 2]); // top edge
      samples.push([Math.floor(width * p), height - 3]); // bottom edge
      samples.push([2, Math.floor(height * p)]); // left edge
      samples.push([width - 3, Math.floor(height * p)]); // right edge
    }

    let sumR = 0, sumG = 0, sumB = 0;
    let count = 0;

    for (const [x, y] of samples) {
      if (x >= 0 && x < width && y >= 0 && y < height) {
        const p = ctx.getImageData(x, y, 1, 1).data;
        sumR += p[0];
        sumG += p[1];
        sumB += p[2];
        count++;
      }
    }

    if (count === 0) return { r: 255, g: 255, b: 255 };
    return {
      r: Math.round(sumR / count),
      g: Math.round(sumG / count),
      b: Math.round(sumB / count),
    };
  };

  // Automatic Background Removal Algorithm
  const processImage = (
    imageSourceUrl: string,
    customColor?: { r: number; g: number; b: number },
    customTol?: number,
    customFeather?: number,
    customMode?: 'flood' | 'global'
  ) => {
    setIsProcessing(true);
    setStatusMessage('Analyzing photo & removing background...');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSourceUrl;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);

      const detectedBg = customColor || sampleDominantBorderColor(ctx, width, height);
      if (!customColor) {
        setTargetColor(detectedBg);
      }

      const tol = customTol !== undefined ? customTol : tolerance;
      const fth = customFeather !== undefined ? customFeather : feather;
      const currentMode = customMode || mode;

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const targetR = detectedBg.r;
      const targetG = detectedBg.g;
      const targetB = detectedBg.b;
      const maxDistance = tol * 2.8;
      const featherRange = fth * 1.8;

      const colorDistance = (r: number, g: number, b: number): number => {
        // Weighted Euclidean color distance for human perception
        const rmean = (r + targetR) / 2;
        const dr = r - targetR;
        const dg = g - targetG;
        const db = b - targetB;
        return Math.sqrt((((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8));
      };

      if (currentMode === 'flood') {
        // Connected BFS Flood-fill from borders:
        // Protects foreground objects (like white shirts or eyes) that have colors similar to background
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        const isMatchingBg = (x: number, y: number): boolean => {
          const idx = (y * width + x) * 4;
          return colorDistance(data[idx], data[idx + 1], data[idx + 2]) <= maxDistance + featherRange;
        };

        // Seed with all border pixels
        for (let x = 0; x < width; x++) {
          if (isMatchingBg(x, 0)) {
            const idx = 0 * width + x;
            visited[idx] = 1;
            queue.push(idx);
          }
          if (isMatchingBg(x, height - 1)) {
            const idx = (height - 1) * width + x;
            visited[idx] = 1;
            queue.push(idx);
          }
        }
        for (let y = 0; y < height; y++) {
          if (isMatchingBg(0, y)) {
            const idx = y * width + 0;
            if (!visited[idx]) {
              visited[idx] = 1;
              queue.push(idx);
            }
          }
          if (isMatchingBg(width - 1, y)) {
            const idx = y * width + (width - 1);
            if (!visited[idx]) {
              visited[idx] = 1;
              queue.push(idx);
            }
          }
        }

        // BFS traversal
        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const cx = curr % width;
          const cy = Math.floor(curr / width);

          // 4-neighborhood
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (!visited[nIdx] && isMatchingBg(nx, ny)) {
                visited[nIdx] = 1;
                queue.push(nIdx);
              }
            }
          }
        }

        // Apply transparency and feathering only to visited background pixels
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pIdx = y * width + x;
            if (visited[pIdx]) {
              const dIdx = pIdx * 4;
              const dist = colorDistance(data[dIdx], data[dIdx + 1], data[dIdx + 2]);
              if (dist <= maxDistance) {
                data[dIdx + 3] = 0; // 100% transparent
              } else if (dist <= maxDistance + featherRange) {
                const alphaFactor = (dist - maxDistance) / featherRange;
                data[dIdx + 3] = Math.round(data[dIdx + 3] * alphaFactor);
              }
            }
          }
        }
      } else {
        // Global Color Key mode (standard chroma/studio backdrop)
        for (let i = 0; i < data.length; i += 4) {
          const dist = colorDistance(data[i], data[i + 1], data[i + 2]);
          if (dist <= maxDistance) {
            data[i + 3] = 0;
          } else if (dist <= maxDistance + featherRange) {
            const alphaFactor = (dist - maxDistance) / featherRange;
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (transparentDataUrl) URL.revokeObjectURL(transparentDataUrl);
          const dataUrl = URL.createObjectURL(blob);
          setTransparentDataUrl(dataUrl);
          setIsProcessing(false);
          setStatusMessage('Background successfully made transparent!');
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
        }
      }, 'image/png');
    };
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);

    // Auto-execute immediately upon image selection!
    processImage(url);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pickingColor || !originalUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      tempCtx.drawImage(img, 0, 0);
      const pixel = tempCtx.getImageData(x, y, 1, 1).data;
      const picked = { r: pixel[0], g: pixel[1], b: pixel[2] };
      setTargetColor(picked);
      setPickingColor(false);
      processImage(originalUrl, picked, tolerance, feather, mode);
    };
  };

  const handleDownload = () => {
    if (!transparentDataUrl || !file) return;
    const a = document.createElement('a');
    a.href = transparentDataUrl;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${base}_transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 45, spread: 80, origin: { y: 0.7 } });
  };

  const handleReset = () => {
    if (transparentDataUrl) URL.revokeObjectURL(transparentDataUrl);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    setFile(null);
    setOriginalUrl(null);
    setTransparentDataUrl(null);
    setStatusMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getPreviewBgStyle = () => {
    switch (previewBg) {
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-slate-950';
      case 'blue':
        return 'bg-blue-600';
      case 'checkerboard':
      default:
        return 'bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#475569_1.2px,transparent_1.2px)] [background-size:16px_16px] bg-slate-100 dark:bg-slate-900';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-12 text-center hover:bg-emerald-50 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce duration-1000">
            <Eraser className="h-8 w-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Upload Photo for Instant Transparent Background
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Drag &amp; drop any image or <span className="font-bold text-emerald-600 dark:text-emerald-400 underline">browse files</span>. The background turns transparent automatically!
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1">
              ✨ Automatic Perimeter Flood-Fill
            </span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1">
              🚀 High-Resolution Transparent PNG
            </span>
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1">
              🔒 100% Client-Side Privacy
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Status Bar & Download Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-emerald-50/80 p-4 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {statusMessage || 'Background Removed Successfully!'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {file.name} • Clean transparent PNG with alpha channel ready to use anywhere
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!transparentDataUrl || isProcessing}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download Transparent PNG</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`rounded-xl border p-2.5 cursor-pointer transition-colors ${
                  showSettings
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
                title="Tolerance &amp; Edge Settings"
              >
                <Sliders className="h-4 w-4" />
              </button>
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-300 bg-white p-2.5 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                title="Upload Another Photo"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Background Preview Backdrop Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-emerald-500" />
              <span>Preview Background:</span>
            </span>
            <div className="flex items-center gap-2">
              {[
                { id: 'checkerboard', label: '🏁 Transparent' },
                { id: 'white', label: '⚪ White' },
                { id: 'black', label: '⚫ Dark' },
                { id: 'blue', label: '🔵 Passport Blue' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setPreviewBg(bg.id as PreviewBg)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    previewBg === bg.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Fine-Tuning Drawer */}
          {showSettings && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Precision Fine-Tuning &amp; Keying
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('flood');
                      if (originalUrl) processImage(originalUrl, targetColor, tolerance, feather, 'flood');
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      mode === 'flood'
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Boundary Flood Fill (Default)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('global');
                      if (originalUrl) processImage(originalUrl, targetColor, tolerance, feather, 'global');
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                      mode === 'global'
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Global Studio Screen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Sample Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs"
                      style={{ backgroundColor: `rgb(${targetColor.r},${targetColor.g},${targetColor.b})` }}
                    />
                    <button
                      type="button"
                      onClick={() => setPickingColor(!pickingColor)}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                        pickingColor
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <Pipette className="h-3.5 w-3.5" />
                      {pickingColor ? 'Click image to pick...' : 'Eyedropper'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    <span>Tolerance (Color Range)</span>
                    <span className="font-mono text-emerald-600 font-bold">{tolerance}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={tolerance}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTolerance(val);
                      if (originalUrl) processImage(originalUrl, targetColor, val, feather, mode);
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    <span>Edge Feathering</span>
                    <span className="font-mono text-emerald-600 font-bold">{feather}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={feather}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFeather(val);
                      if (originalUrl) processImage(originalUrl, targetColor, tolerance, val, mode);
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Interactive Transparent Checkerboard Canvas View */}
          <div className="space-y-2">
            <div className={`relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-6 min-h-[380px] transition-colors ${getPreviewBgStyle()}`}>
              {isProcessing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent"></div>
                    <p className="mt-2 text-xs font-bold text-slate-800 dark:text-white">
                      Processing transparency...
                    </p>
                  </div>
                </div>
              )}

              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`max-h-[500px] max-w-full rounded-xl shadow-lg transition-all ${
                  pickingColor ? 'cursor-crosshair ring-4 ring-emerald-500' : ''
                }`}
              />
            </div>
          </div>

          {/* Download Button Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleDownload}
              disabled={!transparentDataUrl || isProcessing}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-base font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
            >
              <Download className="h-5 w-5" />
              <span>Download Transparent PNG Image</span>
            </button>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Upload another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
