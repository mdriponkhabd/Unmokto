import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCw, Video, Play, Pause, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const VideoCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [targetRes, setTargetRes] = useState<number>(720); // 720p default
  const [targetBitrate, setTargetBitrate] = useState<number>(1000000); // 1 Mbps default
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<boolean>(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (selected: File) => {
    if (!selected.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WebM, MOV).');
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setVideoSrc(url);
    setResultBlob(null);
    setResultUrl(null);
    setProgress(0);
    abortRef.current = false;
  };

  const onLoadedMetadata = () => {
    if (hiddenVideoRef.current) {
      setDuration(hiddenVideoRef.current.duration || 0);
      setOrigWidth(hiddenVideoRef.current.videoWidth || 0);
      setOrigHeight(hiddenVideoRef.current.videoHeight || 0);
    }
  };

  const startCompression = async () => {
    const video = hiddenVideoRef.current;
    if (!video || !file) return;

    setIsCompressing(true);
    setProgress(1);
    abortRef.current = false;

    try {
      // Calculate output width/height based on target resolution
      let outWidth = origWidth;
      let outHeight = origHeight;

      if (origHeight > targetRes) {
        outHeight = targetRes;
        outWidth = Math.round((origWidth * targetRes) / origHeight);
        // Ensure even dimensions
        if (outWidth % 2 !== 0) outWidth -= 1;
        if (outHeight % 2 !== 0) outHeight -= 1;
      }

      const canvas = document.createElement('canvas');
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      const stream = canvas.captureStream(30);

      // Add audio track if available
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioContext.destination);
        const audioTracks = destination.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          stream.addTrack(audioTracks[0]);
        }
      } catch (err) {
        console.warn('Audio capture note:', err);
      }

      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: targetBitrate,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const completionPromise = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };
      });

      mediaRecorder.start();
      video.currentTime = 0;
      video.playbackRate = 2.0; // 2x speed for faster in-browser compression
      await video.play();

      const totalDur = video.duration;

      const drawFrame = () => {
        if (abortRef.current || video.ended || video.paused) {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          return;
        }

        ctx.drawImage(video, 0, 0, outWidth, outHeight);
        const currentProg = Math.min(99, Math.round((video.currentTime / totalDur) * 100));
        setProgress(currentProg);

        requestAnimationFrame(drawFrame);
      };

      drawFrame();

      const compressedBlob = await completionPromise;
      setResultBlob(compressedBlob);
      const url = URL.createObjectURL(compressedBlob);
      setResultUrl(url);
      setProgress(100);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      console.error('Video compression error:', e);
      alert('Error during video compression. Your browser may not support media recording.');
    } finally {
      setIsCompressing(false);
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.playbackRate = 1.0;
      }
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const base = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `compressed_${base}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    abortRef.current = true;
    setFile(null);
    setVideoSrc(null);
    setResultBlob(null);
    setResultUrl(null);
    setProgress(0);
    setIsCompressing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const percentSaved =
    file && resultBlob
      ? Math.max(0, Math.round(((file.size - resultBlob.size) / file.size) * 100))
      : 0;

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
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <Video className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Choose a video file to compress
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or <span className="font-semibold text-emerald-600 dark:text-emerald-400">browse video</span>
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Supports MP4, WebM, MOV • 100% Client-side processing
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hidden reference video for canvas processing */}
          {videoSrc && (
            <video
              ref={hiddenVideoRef}
              src={videoSrc}
              onLoadedMetadata={onLoadedMetadata}
              className="hidden"
              playsInline
              muted
            />
          )}

          {/* Info & Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Original Video</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-1 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatBytes(file.size)} • {origWidth}×{origHeight} px • {duration.toFixed(1)}s
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Target Resolution
              </label>
              <select
                value={targetRes}
                onChange={(e) => setTargetRes(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={1080}>1080p (Full HD)</option>
                <option value={720}>720p (HD - Best for sharing)</option>
                <option value={480}>480p (SD - Very small)</option>
                <option value={360}>360p (Ultra compact)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Target Bitrate
              </label>
              <select
                value={targetBitrate}
                onChange={(e) => setTargetBitrate(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={2000000}>2.0 Mbps (High Quality)</option>
                <option value={1000000}>1.0 Mbps (Recommended)</option>
                <option value={600000}>600 kbps (Compact)</option>
                <option value={350000}>350 kbps (Maximum Compression)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={startCompression}
              disabled={isCompressing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-500 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isCompressing ? `Processing (${progress}%)...` : 'Compress Video'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Progress bar */}
          {isCompressing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Encoding video frames...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Result Card */}
          {resultUrl && resultBlob && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Video Compressed Successfully!
                    </span>
                    <span className="rounded-full bg-emerald-500 text-white px-2 py-0.5 text-xs font-bold">
                      -{percentSaved}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span>Original: <strong>{formatBytes(file.size)}</strong></span>
                    <span>•</span>
                    <span>Compressed: <strong className="text-emerald-700 dark:text-emerald-300">{formatBytes(resultBlob.size)}</strong></span>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Compressed Video
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg bg-black aspect-video max-h-72 flex items-center justify-center">
                <video src={resultUrl} controls className="h-full w-full object-contain" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
