import React from 'react';
import { ImageCompressor } from './ImageCompressor';
import { ImageResizer } from './ImageResizer';
import { JpgToPng } from './JpgToPng';
import { PngToJpg } from './PngToJpg';
import { PdfToJpg } from './PdfToJpg';
import { JpgToPdf } from './JpgToPdf';
import { PdfCompressor } from './PdfCompressor';
import { VideoCompressor } from './VideoCompressor';
import { QrCodeGenerator } from './QrCodeGenerator';
import { WordCounter } from './WordCounter';
import { TextCaseConverter } from './TextCaseConverter';
import { AgeCalculator } from './AgeCalculator';
import { BmiCalculator } from './BmiCalculator';
import { PasswordGenerator } from './PasswordGenerator';
import { UrlShortener } from './UrlShortener';
import { BackgroundRemover } from './BackgroundRemover';
import { YoutubeThumbnailDownloader } from './YoutubeThumbnailDownloader';
import { ImageCropper } from './ImageCropper';

interface ToolRendererProps {
  slug: string;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ slug }) => {
  switch (slug) {
    case 'image-compressor':
      return <ImageCompressor />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'jpg-to-png':
      return <JpgToPng />;
    case 'png-to-jpg':
      return <PngToJpg />;
    case 'pdf-to-jpg':
      return <PdfToJpg />;
    case 'jpg-to-pdf':
      return <JpgToPdf />;
    case 'pdf-compressor':
      return <PdfCompressor />;
    case 'video-compressor':
      return <VideoCompressor />;
    case 'qr-code-generator':
      return <QrCodeGenerator />;
    case 'word-counter':
      return <WordCounter />;
    case 'text-case-converter':
      return <TextCaseConverter />;
    case 'age-calculator':
      return <AgeCalculator />;
    case 'bmi-calculator':
      return <BmiCalculator />;
    case 'password-generator':
      return <PasswordGenerator />;
    case 'url-shortener':
      return <UrlShortener />;
    case 'background-remover':
      return <BackgroundRemover />;
    case 'youtube-thumbnail-downloader':
      return <YoutubeThumbnailDownloader />;
    case 'image-cropper':
      return <ImageCropper />;
    default:
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300">Tool not found or under maintenance.</p>
        </div>
      );
  }
};
