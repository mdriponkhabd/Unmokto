import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Files, Trash2, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(10); // mm
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const newItems: ImageItem[] = [];
    Array.from(fileList).forEach((f) => {
      if (f.type.startsWith('image/')) {
        const url = URL.createObjectURL(f);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              file: f,
              previewUrl: url,
              width: img.naturalWidth,
              height: img.naturalHeight,
            },
          ]);
        };
      }
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setPdfUrl(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setImages(copy);
    setPdfUrl(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const item = images[i];

        const availWidth = pageWidth - margin * 2;
        const availHeight = pageHeight - margin * 2;

        const imgRatio = item.width / item.height;
        const pageRatio = availWidth / availHeight;

        let renderWidth = availWidth;
        let renderHeight = availHeight;

        if (imgRatio > pageRatio) {
          renderWidth = availWidth;
          renderHeight = availWidth / imgRatio;
        } else {
          renderHeight = availHeight;
          renderWidth = availHeight * imgRatio;
        }

        const posX = margin + (availWidth - renderWidth) / 2;
        const posY = margin + (availHeight - renderHeight) / 2;

        doc.addImage(item.previewUrl, 'JPEG', posX, posY, renderWidth, renderHeight);
      }

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
      alert('Error generating PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Unmokto_Combined_${images.length}_images.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setImages([]);
    setPdfUrl(null);
    setPdfBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20 cursor-pointer mb-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white">
          Add JPG, PNG, or WebP images
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Select single or multiple files • Drag to re-order below
        </p>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Page Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="portrait">Portrait (Standard A4)</option>
                <option value="landscape">Landscape (Horizontal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Page Margins
              </label>
              <select
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={0}>No Margin (Edge-to-edge)</option>
                <option value={10}>Standard (10mm)</option>
                <option value={20}>Wide (20mm)</option>
              </select>
            </div>
          </div>

          {/* Image List Preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Images to compile ({images.length} pages)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800 group"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded bg-slate-200 dark:bg-slate-900">
                    <img src={item.previewUrl} alt="Thumbnail" className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Page {idx + 1}</span>
                    <div className="flex gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'up')}
                          className="hover:text-emerald-600"
                          title="Move left"
                        >
                          <ArrowUp className="h-3 w-3 -rotate-90" />
                        </button>
                      )}
                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(idx, 'down')}
                          className="hover:text-emerald-600"
                          title="Move right"
                        >
                          <ArrowDown className="h-3 w-3 -rotate-90" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(item.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={generatePdf}
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Download Result */}
          {pdfUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    PDF Document Generated!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {images.length} pages • {pdfBlob ? (pdfBlob.size / 1024).toFixed(1) : 0} KB
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
