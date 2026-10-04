import React from 'react';
import { Zap, Shield, Heart, ExternalLink, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useApp();

  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName || settings.siteName || 'Unmokto'}
                  className="h-9 max-w-[140px] object-contain"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
                  <Zap className="h-5 w-5 fill-current" />
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {settings.companyName || settings.siteName || 'Unmokto'}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {settings.tagline || 'Free online tools for everyone.'} Fast, privacy-focused browser utilities that process your files directly on your device. No signup, no fees, no hassle.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>100% Client-Side Processing • Your Files Never Leave Your Device</span>
            </div>
          </div>

          {/* Column 2: Tools (Image & PDF) */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Popular Tools
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/tools/image-compressor')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/pdf-to-jpg')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  PDF to JPG
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/jpg-to-pdf')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  JPG to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/qr-code-generator')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  QR Code Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tools/video-compressor')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Video Compressor
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Tool Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/category/image')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Image Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/category/pdf')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  PDF Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/category/video')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Video Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/category/text')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Text Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/category/calculator')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Calculators
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company / Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Company & Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/privacy-policy')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/terms-of-service')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/disclaimer')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 pt-6 sm:flex-row dark:border-slate-800 text-xs text-slate-500">
          <p>{settings.footerText || '© 2026 Unmokto. All Rights Reserved.'}</p>
          <div className="mt-3 flex items-center gap-4 sm:mt-0">
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500 fill-current inline" /> for web speed
            </span>
            {/* Subtle discreet admin portal link for the site owner without exposing it to visitors as user sign in */}
            <button
              onClick={() => handleNav('/admin')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
              title="Admin Portal"
            >
              <Lock className="h-3 w-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
