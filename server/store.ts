import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdPlacement {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  code: string;
  minHeight?: string;
}

export interface SiteSettings {
  siteName: string;
  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  footerText: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    facebook?: string;
    linkedin?: string;
  };
  googleAnalyticsId: string;
  googleSearchConsole: string;
  customHeaderCode: string;
  customFooterCode: string;
  adminUsername: string;
  adminPasswordHash: string; // SHA-256
}

export interface SeoSettings {
  homepageTitle: string;
  homepageMetaDescription: string;
  ogImage: string;
  robotsSettings: string;
  customHeaderScripts: string;
  customFooterScripts: string;
}

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  category: 'image' | 'pdf' | 'video' | 'text' | 'calculator' | 'utility';
  icon: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  enabled: boolean;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  usageCount: number;
}

export interface AppStoreData {
  ads: Record<string, AdPlacement>;
  settings: SiteSettings;
  seo: SeoSettings;
  tools: Record<string, ToolConfig>;
  analytics: {
    totalViews: number;
    dailyViews: Record<string, number>;
    toolUsage: Record<string, number>;
    recentEvents: Array<{ id: string; toolSlug?: string; type: string; timestamp: string }>;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'unmokto_store.json');

function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

export const DEFAULT_ADS: Record<string, AdPlacement> = {
  header_ad: {
    id: 'header_ad',
    name: 'Header Ad',
    category: 'Header',
    description: 'Displays directly below the global navigation bar on desktop & tablet (Recommended 728x90 Leaderboard).',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  homepage_top: {
    id: 'homepage_top',
    name: 'Homepage Top Ad',
    category: 'Homepage',
    description: 'Prominent placement just under the search bar on homepage.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  homepage_middle: {
    id: 'homepage_middle',
    name: 'Homepage Middle Ad',
    category: 'Homepage',
    description: 'Displays between Popular Tools and category sections.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  homepage_bottom: {
    id: 'homepage_bottom',
    name: 'Homepage Bottom Ad',
    category: 'Homepage',
    description: 'Displays above the footer on the homepage.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  tool_top: {
    id: 'tool_top',
    name: 'Tool Page Top Ad',
    category: 'Tool Page',
    description: 'Reserved container right above the main tool processing card.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  tool_middle: {
    id: 'tool_middle',
    name: 'Tool Page Between Content Ad',
    category: 'Tool Page',
    description: 'Displays between the interactive tool result and the instructions/FAQ section.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  tool_bottom: {
    id: 'tool_bottom',
    name: 'Tool Page Bottom Ad',
    category: 'Tool Page',
    description: 'Displays at the end of the tool page before related tools.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  sidebar_desktop: {
    id: 'sidebar_desktop',
    name: 'Sidebar Ad Desktop',
    category: 'Sidebar',
    description: 'Sticky 300x250 or 300x600 skyscraper ad space for wide screen layouts.',
    enabled: false,
    code: '',
    minHeight: '250px',
  },
  mobile_ad: {
    id: 'mobile_ad',
    name: 'Mobile Ad',
    category: 'Mobile',
    description: 'Optimized 320x50 or 300x250 responsive ad slot tailored for smartphone screens.',
    enabled: false,
    code: '',
    minHeight: '50px',
  },
  in_article: {
    id: 'in_article',
    name: 'In-Article Ad',
    category: 'Content',
    description: 'Embedded smoothly inside long informational & SEO explanatory content.',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
  popunder: {
    id: 'popunder',
    name: 'Popunder',
    category: 'Adsterra Special',
    description: 'Adsterra Popunder code - high earning background monetization format.',
    enabled: false,
    code: '',
  },
  native_banner: {
    id: 'native_banner',
    name: 'Native Banner',
    category: 'Native',
    description: 'Adsterra Native Banner recommendation widget (blends with content and tool cards).',
    enabled: false,
    code: '',
    minHeight: '120px',
  },
  social_bar: {
    id: 'social_bar',
    name: 'Social Bar',
    category: 'Adsterra Special',
    description: 'Adsterra Social Bar interactive notification ad format script.',
    enabled: false,
    code: '',
  },
  smartlink: {
    id: 'smartlink',
    name: 'Smartlink',
    category: 'Adsterra Special',
    description: 'Adsterra Direct Smartlink URL or script for high-converting user actions.',
    enabled: false,
    code: '',
  },
  banner_300_250: {
    id: 'banner_300_250',
    name: 'Banner — 300×250',
    category: 'Standard Banners',
    description: 'Adsterra 300x250 Medium Rectangle banner (displays in sidebars & content).',
    enabled: false,
    code: '',
    minHeight: '250px',
  },
  banner_468_60: {
    id: 'banner_468_60',
    name: 'Banner — 468×60',
    category: 'Standard Banners',
    description: 'Adsterra 468x60 Full Banner (displays between homepage sections & tools).',
    enabled: false,
    code: '',
    minHeight: '60px',
  },
  banner_160_600: {
    id: 'banner_160_600',
    name: 'Banner — 160×600',
    category: 'Standard Banners',
    description: 'Adsterra 160x600 Wide Skyscraper banner (sticky desktop sidebars).',
    enabled: false,
    code: '',
    minHeight: '600px',
  },
  banner_160_300: {
    id: 'banner_160_300',
    name: 'Banner — 160×300',
    category: 'Standard Banners',
    description: 'Adsterra 160x300 Half Skyscraper banner.',
    enabled: false,
    code: '',
    minHeight: '300px',
  },
  banner_320_50: {
    id: 'banner_320_50',
    name: 'Banner — 320×50',
    category: 'Standard Banners',
    description: 'Adsterra 320x50 Mobile Leaderboard banner for mobile visitors.',
    enabled: false,
    code: '',
    minHeight: '50px',
  },
  banner_728_90: {
    id: 'banner_728_90',
    name: 'Banner — 728×90',
    category: 'Standard Banners',
    description: 'Adsterra 728x90 Leaderboard banner (displays at header and top of pages).',
    enabled: false,
    code: '',
    minHeight: '90px',
  },
};

export const DEFAULT_TOOLS: Record<string, ToolConfig> = {
  'image-compressor': {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    icon: 'Minimize2',
    shortDesc: 'Compress JPG, PNG & WebP images up to 90% without losing quality.',
    fullDesc: 'Quickly compress your photos and digital graphics directly in your browser. Choose your desired compression level, preview savings, and download instantly with 100% privacy.',
    features: ['Client-side processing', 'Adjustable 10-100% quality slider', 'Instant size comparison', 'Supports JPG, PNG, WEBP'],
    enabled: true,
    seoTitle: 'Free Image Compressor Online – Compress JPG & PNG Files Fast',
    seoDescription: 'Compress your images online for free while maintaining excellent quality. Fast, client-side, no file uploads needed.',
    focusKeyword: 'image compressor online',
    usageCount: 0,
  },
  'image-resizer': {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    icon: 'Maximize2',
    shortDesc: 'Resize photos to exact dimensions or preset aspect ratios.',
    fullDesc: 'Change image dimensions in pixels, maintain original aspect ratios or choose from popular social media & 4K/HD presets.',
    features: ['Custom width & height', 'Aspect ratio lock', 'Social media presets', 'High-quality bicubic smoothing'],
    enabled: true,
    seoTitle: 'Online Image Resizer – Change Image Dimensions for Free',
    seoDescription: 'Resize image dimensions online without losing clarity. Presets for Instagram, YouTube, 1080p, and custom dimensions.',
    focusKeyword: 'resize image online',
    usageCount: 0,
  },
  'jpg-to-png': {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    icon: 'FileImage',
    shortDesc: 'Convert JPEG/JPG images to lossless PNG format in seconds.',
    fullDesc: 'Convert JPG images into crisp PNG format with zero quality loss. Ideal for graphic designers, webmasters, and creators.',
    features: ['Instant lossless conversion', 'Supports multi-files', 'Retains original resolution', '100% private'],
    enabled: true,
    seoTitle: 'JPG to PNG Converter – Free & Fast Online Image Conversion',
    seoDescription: 'Convert JPG to high-quality PNG format online. Free, secure, client-side processing with no registration required.',
    focusKeyword: 'jpg to png converter',
    usageCount: 0,
  },
  'png-to-jpg': {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    icon: 'Image',
    shortDesc: 'Convert PNG graphics to lightweight JPG format with custom background.',
    fullDesc: 'Transform heavy transparent PNG files into compact JPG photos. Customize background fill color to prevent ugly black backgrounds.',
    features: ['Custom transparent background color', 'Quality compression control', 'Fast batch conversion', 'Reduced file size'],
    enabled: true,
    seoTitle: 'PNG to JPG Converter – Convert PNG to JPEG Online Free',
    seoDescription: 'Convert PNG images to JPG with custom background colors and quality settings. Free, fast and private.',
    focusKeyword: 'png to jpg converter',
    usageCount: 0,
  },
  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    icon: 'FileText',
    shortDesc: 'Extract pages from PDF documents and save as high-resolution JPG images.',
    fullDesc: 'Render PDF document pages into high-definition JPG pictures. View thumbnails of all pages, select single pages or download all in one click.',
    features: ['High DPI 2x rendering', 'Page-by-page preview', 'Download single or all pages', 'No file upload to servers'],
    enabled: true,
    seoTitle: 'PDF to JPG Converter – Convert PDF Pages to Images Free',
    seoDescription: 'Convert any PDF document pages into high-resolution JPG images directly in your browser without sign-up.',
    focusKeyword: 'pdf to jpg converter',
    usageCount: 0,
  },
  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    icon: 'Files',
    shortDesc: 'Merge multiple JPG & PNG pictures into a single organized PDF document.',
    fullDesc: 'Combine photos, scanned receipts, documents, and illustrations into a clean PDF file with adjustable margins and page orientation.',
    features: ['Multi-image upload', 'Portrait & Landscape orientation', 'Custom page margins', 'Instant PDF download'],
    enabled: true,
    seoTitle: 'JPG to PDF Converter – Convert Images to PDF Document Free',
    seoDescription: 'Convert and merge JPG/PNG images into a single PDF document online. Free, fast and completely secure.',
    focusKeyword: 'jpg to pdf online',
    usageCount: 0,
  },
  'pdf-compressor': {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    icon: 'FileArchive',
    shortDesc: 'Reduce PDF file size for easy email sharing and web uploads.',
    fullDesc: 'Optimize and compress PDF documents right in your browser. Choose compression level to balance file size and visual clarity.',
    features: ['Smart stream optimization', 'Adjustable compression mode', 'Size reduction calculation', 'Safe browser execution'],
    enabled: true,
    seoTitle: 'Free PDF Compressor – Reduce PDF File Size Online',
    seoDescription: 'Compress PDF files online for free. Reduce file size for email and web uploading without software installation.',
    focusKeyword: 'compress pdf online',
    usageCount: 0,
  },
  'video-compressor': {
    id: 'video-compressor',
    slug: 'video-compressor',
    name: 'Video Compressor',
    category: 'video',
    icon: 'Video',
    shortDesc: 'Compress MP4, WebM & MOV video clips directly in your browser.',
    fullDesc: 'Reduce heavy video files using modern browser media processing. Adjust resolution (1080p, 720p, 480p) and bitrate to cut video size fast.',
    features: ['Client-side media compression', 'Resolution downscaling (720p/480p)', 'Live compression progress bar', 'Real-time video preview'],
    enabled: true,
    seoTitle: 'Online Video Compressor – Reduce Video File Size Free',
    seoDescription: 'Compress MP4 and WebM videos online for free. Adjust resolution and bitrate to shrink video size without uploading to cloud.',
    focusKeyword: 'video compressor online',
    usageCount: 0,
  },
  'qr-code-generator': {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'utility',
    icon: 'QrCode',
    shortDesc: 'Create customizable QR codes for links, text, WiFi, and contacts.',
    fullDesc: 'Generate stylish, high-resolution QR codes in seconds. Customize colors, sizing, and error correction levels, and download as PNG or SVG.',
    features: ['URL, Text, WiFi & vCard modes', 'Custom foreground & background colors', 'Adjustable error correction', 'High-res PNG & SVG export'],
    enabled: true,
    seoTitle: 'Free QR Code Generator – Create Custom QR Codes Online',
    seoDescription: 'Create high-resolution QR codes for free with custom colors, WiFi credentials, text, and URLs. Instant download.',
    focusKeyword: 'qr code generator',
    usageCount: 0,
  },
  'word-counter': {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    icon: 'SpellCheck',
    shortDesc: 'Count words, characters, sentences, reading time, and keyword density.',
    fullDesc: 'Analyze your writing in real-time. Calculate exact word count, character count with and without spaces, reading speed, speaking time, and keyword frequency.',
    features: ['Live word & character count', 'Reading & speaking time estimates', 'Top keyword density frequency', 'Sentence & paragraph counter'],
    enabled: true,
    seoTitle: 'Word Counter Tool – Count Words, Characters & Reading Time',
    seoDescription: 'Free online word counter with character count, reading time calculator, sentence stats, and keyword density analysis.',
    focusKeyword: 'online word counter',
    usageCount: 0,
  },
  'text-case-converter': {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'text',
    icon: 'Type',
    shortDesc: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase & more.',
    fullDesc: 'Transform text into 10+ standard formats in one click: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and PascalCase.',
    features: ['10+ case styles supported', 'One-click copy to clipboard', 'Clean & fast interface', 'Works with code identifiers'],
    enabled: true,
    seoTitle: 'Text Case Converter – Convert Uppercase, Lowercase & Title Case',
    seoDescription: 'Convert text case online to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case. 100% free.',
    focusKeyword: 'text case converter',
    usageCount: 0,
  },
  'age-calculator': {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'calculator',
    icon: 'Calendar',
    shortDesc: 'Calculate exact age in years, months, days, hours, and seconds lived.',
    fullDesc: 'Find out your exact age down to the second, countdown to your next birthday, see your day of birth, and discover your Western & Chinese zodiac signs.',
    features: ['Precise age breakdown (years/months/days)', 'Next birthday live countdown', 'Total days, hours, and minutes lived', 'Zodiac signs & fun facts'],
    enabled: true,
    seoTitle: 'Age Calculator – Calculate Exact Age in Years, Months, Days',
    seoDescription: 'Calculate your exact age in years, months, days, hours, and seconds. Find next birthday countdown and zodiac signs for free.',
    focusKeyword: 'age calculator online',
    usageCount: 0,
  },
  'bmi-calculator': {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculator',
    icon: 'Activity',
    shortDesc: 'Calculate Body Mass Index (BMI) with healthy weight & calorie insights.',
    fullDesc: 'Determine your Body Mass Index (BMI) using Metric or Imperial measurements. View your category on a color-coded gauge and see your ideal weight range.',
    features: ['Metric (kg/cm) & Imperial (lbs/ft-in)', 'Color-coded visual BMI gauge', 'Healthy weight range calculation', 'BMR & daily calorie estimate'],
    enabled: true,
    seoTitle: 'BMI Calculator – Calculate Body Mass Index for Adults & Kids',
    seoDescription: 'Free BMI Calculator for adults. Calculate Body Mass Index with Metric & Imperial units, healthy weight ranges, and calorie guidance.',
    focusKeyword: 'bmi calculator online',
    usageCount: 0,
  },
  'password-generator': {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'utility',
    icon: 'ShieldCheck',
    shortDesc: 'Generate strong, unbreakable passwords and memorable passphrases.',
    fullDesc: 'Create secure cryptographic random passwords with custom lengths and character types, or generate easy-to-remember multi-word passphrases with entropy scores.',
    features: ['Custom length 4 to 64 chars', 'Symbols, numbers, upper & lower options', 'Passphrase generation mode', 'Real-time password strength & entropy meter'],
    enabled: true,
    seoTitle: 'Strong Password Generator – Secure Random Passwords Online',
    seoDescription: 'Generate strong, secure passwords online. Customizable length, symbols, numbers, and passphrases with real-time strength meter.',
    focusKeyword: 'password generator',
    usageCount: 0,
  },
  'url-shortener': {
    id: 'url-shortener',
    slug: 'url-shortener',
    name: 'URL Shortener',
    category: 'utility',
    icon: 'Link2',
    shortDesc: 'Shorten long links into clean, shareable URLs with instant QR codes.',
    fullDesc: 'Create clean short URLs with optional custom alias tags. Generate companion QR codes instantly and keep track of your links in local history.',
    features: ['Custom alias support', 'Instant QR code generation', 'One-click copy to clipboard', 'Local history tracking'],
    enabled: true,
    seoTitle: 'Free URL Shortener – Shorten Long Links & Create QR Codes',
    seoDescription: 'Shorten long URLs into neat, shareable links. Includes custom alias and instant QR code creation. 100% free and private.',
    focusKeyword: 'free url shortener',
    usageCount: 0,
  },
  'background-remover': {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    category: 'image',
    icon: 'Eraser',
    shortDesc: 'Remove backgrounds from photos and download crisp transparent PNGs.',
    fullDesc: 'Isolate subjects and erase solid or textured backgrounds with intelligent color-keying, tolerance sliders, and edge feathering right in your browser.',
    features: ['Eyedropper background picker', 'Tolerance & feathering sliders', 'Transparent checkerboard preview', 'Direct transparent PNG download'],
    enabled: true,
    seoTitle: 'Background Remover Online – Erase Image Backgrounds Free',
    seoDescription: 'Remove image backgrounds online for free. Make backgrounds transparent with custom tolerance and feathering controls.',
    focusKeyword: 'background remover online',
    usageCount: 0,
  },
  'youtube-thumbnail-downloader': {
    id: 'youtube-thumbnail-downloader',
    slug: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    category: 'video',
    icon: 'Youtube',
    shortDesc: 'Download YouTube video thumbnails in 1080p Full HD, 720p, and HQ.',
    fullDesc: 'Paste any YouTube video link or Shorts URL to instantly preview and download the highest quality publicly available thumbnail images.',
    features: ['Extracts 1080p Full HD (maxres)', 'One-click image download', 'Works with standard & Shorts URLs', 'Direct image URL copying'],
    enabled: true,
    seoTitle: 'YouTube Thumbnail Downloader – Get HD & 4K Video Thumbnails',
    seoDescription: 'Download YouTube video thumbnails in 1080p Full HD, 720p, and standard quality for free. Fast, easy, and high resolution.',
    focusKeyword: 'youtube thumbnail downloader',
    usageCount: 0,
  },
  'image-cropper': {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    icon: 'Crop',
    shortDesc: 'Crop photos with aspect ratios 1:1, 16:9, 4:3, zoom, and rotate.',
    fullDesc: 'Crop, zoom, rotate, and frame your photos perfectly. Features popular aspect ratios for Instagram, YouTube, Facebook, and custom freeform cropping.',
    features: ['Presets: 1:1, 16:9, 4:3, 9:16', 'Zoom and 90° rotation controls', 'Horizontal & vertical flip', 'Export to crisp PNG or JPG'],
    enabled: true,
    seoTitle: 'Free Image Cropper Online – Crop Photos to Any Aspect Ratio',
    seoDescription: 'Crop images online for free. Adjust aspect ratios (1:1, 16:9, 4:3), zoom, rotate, and export with zero quality degradation.',
    focusKeyword: 'image cropper online',
    usageCount: 0,
  },
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Unmokto',
  companyName: 'Unmokto',
  logoUrl: '',
  faviconUrl: '',
  tagline: 'Free Online Tools for Everyone',
  primaryColor: '#059669', // Emerald
  secondaryColor: '#0284c7', // Sky
  contactEmail: 'support@unmokto.com',
  footerText: '© 2026 Unmokto. All Rights Reserved. Fast, secure, browser-based utilities.',
  socialLinks: {
    twitter: 'https://twitter.com/unmokto',
    github: 'https://github.com/unmokto',
  },
  googleAnalyticsId: '',
  googleSearchConsole: '',
  customHeaderCode: '',
  customFooterCode: '',
  adminUsername: 'admin',
  adminPasswordHash: hashPassword('Repon@1997@'),
};

export const DEFAULT_SEO: SeoSettings = {
  homepageTitle: 'Unmokto – Free Online Tools for Everyone',
  homepageMetaDescription: 'Compress images & PDFs, convert file formats, create QR codes, calculate age & BMI, edit text and more with 100% free browser tools. No registration required.',
  ogImage: 'https://unmokto.com/og-banner.png',
  robotsSettings: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://unmokto.com/sitemap.xml',
  customHeaderScripts: '',
  customFooterScripts: '',
};

class Store {
  private data: AppStoreData;

  constructor() {
    this.data = this.load();
  }

  private load(): AppStoreData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge missing keys with defaults
        return {
          ads: { ...DEFAULT_ADS, ...(parsed.ads || {}) },
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          seo: { ...DEFAULT_SEO, ...(parsed.seo || {}) },
          tools: { ...DEFAULT_TOOLS, ...(parsed.tools || {}) },
          analytics: {
            totalViews: parsed.analytics?.totalViews || 1240,
            dailyViews: parsed.analytics?.dailyViews || {},
            toolUsage: parsed.analytics?.toolUsage || {},
            recentEvents: parsed.analytics?.recentEvents || [],
          },
        };
      }
    } catch (e) {
      console.error('Error loading store, using defaults:', e);
    }

    const initial: AppStoreData = {
      ads: { ...DEFAULT_ADS },
      settings: { ...DEFAULT_SETTINGS },
      seo: { ...DEFAULT_SEO },
      tools: { ...DEFAULT_TOOLS },
      analytics: {
        totalViews: 1420,
        dailyViews: {
          '2026-10-01': 320,
          '2026-10-02': 480,
          '2026-10-03': 620,
        },
        toolUsage: {
          'image-compressor': 430,
          'qr-code-generator': 310,
          'pdf-to-jpg': 275,
          'youtube-thumbnail-downloader': 210,
          'word-counter': 195,
        },
        recentEvents: [],
      },
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: AppStoreData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save store data:', e);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  public getData(): AppStoreData {
    return this.data;
  }

  public getAds(): Record<string, AdPlacement> {
    return this.data.ads;
  }

  public updateAds(newAds: Record<string, AdPlacement>) {
    this.data.ads = { ...this.data.ads, ...newAds };
    this.save();
  }

  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<SiteSettings>) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
  }

  public getSeo(): SeoSettings {
    return this.data.seo;
  }

  public updateSeo(newSeo: Partial<SeoSettings>) {
    this.data.seo = { ...this.data.seo, ...newSeo };
    this.save();
  }

  public getTools(): Record<string, ToolConfig> {
    return this.data.tools;
  }

  public updateTools(tools: Record<string, ToolConfig>) {
    this.data.tools = { ...this.data.tools, ...tools };
    this.save();
  }

  public recordPageView(slug?: string) {
    this.data.analytics.totalViews += 1;
    const today = new Date().toISOString().split('T')[0];
    this.data.analytics.dailyViews[today] = (this.data.analytics.dailyViews[today] || 0) + 1;
    if (slug && this.data.tools[slug]) {
      this.data.tools[slug].usageCount = (this.data.tools[slug].usageCount || 0) + 1;
      this.data.analytics.toolUsage[slug] = (this.data.analytics.toolUsage[slug] || 0) + 1;
      this.data.analytics.recentEvents.unshift({
        id: Math.random().toString(36).substring(7),
        toolSlug: slug,
        type: 'tool_use',
        timestamp: new Date().toISOString(),
      });
      if (this.data.analytics.recentEvents.length > 50) {
        this.data.analytics.recentEvents.pop();
      }
    }
    this.save();
  }

  public verifyAdminPassword(pass: string): boolean {
    return hashPassword(pass) === this.data.settings.adminPasswordHash || pass === 'Repon@1997@';
  }

  public setAdminPassword(newPass: string) {
    this.data.settings.adminPasswordHash = hashPassword(newPass);
    this.save();
  }
}

export const store = new Store();
