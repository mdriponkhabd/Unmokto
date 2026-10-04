import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileText, Check, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export const PdfToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (selected: File) => {
    if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }

    setFile(selected);
    setPages([]);
    setIsLoading(true);
    setProgress('Loading PDF document...');

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const extractedPages: PageImage[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Rendering page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Crisp 1.5x scale

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // White background for pages
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        await page.render(renderContext as any).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        extractedPages.push({
          pageNumber: i,
          dataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }

      setPages(extractedPages);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
      alert('Failed to parse and render PDF. Please ensure the PDF is not password protected.');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  const handleDownloadSingle = (page: PageImage) => {
    if (!file) return;
    const a = document.createElement('a');
    a.href = page.dataUrl;
    const base = file.name.replace(/\.pdf$/i, '');
    a.download = `${base}_page_${page.pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    if (!file || pages.length === 0) return;
    pages.forEach((p, idx) => {
      setTimeout(() => {
        handleDownloadSingle(p);
      }, idx * 250);
    });
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setSelectedImage(null);
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
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Upload PDF Document
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or <span className="font-semibold text-emerald-600 dark:text-emerald-400">browse files</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Converts all PDF pages into separate high-resolution JPG images
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {pages.length} Pages Extracted
              </p>
            </div>
            <div className="flex items-center gap-2">
              {pages.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download All ({pages.length})
                </button>
              )}
              <button
                onClick={handleReset}
                className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-800/40">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{progress}</p>
            </div>
          )}

          {pages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-800"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="h-full w-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelectedImage(p.dataUrl)}
                        className="rounded-lg bg-white/90 p-2 text-slate-800 hover:bg-white cursor-pointer shadow-md"
                        title="View Full Size"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Page {p.pageNumber}
                    </span>
                    <button
                      onClick={() => handleDownloadSingle(p)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      JPG
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Size Preview Modal */}
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-white p-4 shadow-2xl dark:bg-slate-900"
              >
                <img src={selectedImage} alt="Full preview" className="max-h-[80vh] w-auto mx-auto object-contain" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-3 w-full rounded-lg bg-slate-200 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
