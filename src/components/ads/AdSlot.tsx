import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export type AdSlotKey =
  | 'header_ad'
  | 'homepage_top'
  | 'homepage_middle'
  | 'homepage_bottom'
  | 'tool_top'
  | 'tool_middle'
  | 'tool_bottom'
  | 'sidebar_desktop'
  | 'mobile_ad'
  | 'in_article'
  | 'native_banner'
  | 'banner_728_90'
  | 'banner_300_250'
  | 'banner_468_60'
  | 'banner_160_600'
  | 'banner_160_300'
  | 'banner_320_50'
  | 'smartlink';

interface AdSlotProps {
  placementKey: AdSlotKey;
  className?: string;
  previewCode?: string; // used in admin preview
  forceShow?: boolean;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  placementKey,
  className = '',
  previewCode,
  forceShow = false,
}) => {
  const { ads } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart resolution: if specific slot is not set, check corresponding size-based Adsterra banner
  let resolvedAd = ads[placementKey];

  if (!resolvedAd?.code?.trim() || !resolvedAd.enabled) {
    if (placementKey === 'header_ad' || placementKey === 'homepage_top' || placementKey === 'tool_top') {
      if (ads['banner_728_90']?.enabled && ads['banner_728_90']?.code?.trim()) {
        resolvedAd = ads['banner_728_90'];
      }
    } else if (placementKey === 'sidebar_desktop') {
      if (ads['banner_300_250']?.enabled && ads['banner_300_250']?.code?.trim()) {
        resolvedAd = ads['banner_300_250'];
      } else if (ads['banner_160_600']?.enabled && ads['banner_160_600']?.code?.trim()) {
        resolvedAd = ads['banner_160_600'];
      } else if (ads['banner_160_300']?.enabled && ads['banner_160_300']?.code?.trim()) {
        resolvedAd = ads['banner_160_300'];
      }
    } else if (placementKey === 'mobile_ad') {
      if (ads['banner_320_50']?.enabled && ads['banner_320_50']?.code?.trim()) {
        resolvedAd = ads['banner_320_50'];
      }
    } else if (placementKey === 'homepage_middle' || placementKey === 'tool_middle' || placementKey === 'in_article') {
      if (ads['banner_468_60']?.enabled && ads['banner_468_60']?.code?.trim()) {
        resolvedAd = ads['banner_468_60'];
      } else if (ads['banner_300_250']?.enabled && ads['banner_300_250']?.code?.trim()) {
        resolvedAd = ads['banner_300_250'];
      } else if (ads['banner_728_90']?.enabled && ads['banner_728_90']?.code?.trim()) {
        resolvedAd = ads['banner_728_90'];
      }
    }
  }

  const isEnabled = forceShow || (resolvedAd && resolvedAd.enabled);
  const codeToRender = previewCode !== undefined ? previewCode : (resolvedAd?.code || '');
  const minHeight = resolvedAd?.minHeight || (placementKey === 'sidebar_desktop' || placementKey === 'banner_300_250' ? '250px' : '90px');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Clear previous ad content
    container.innerHTML = '';

    if (!isEnabled || !codeToRender.trim()) {
      return;
    }

    try {
      // Create a temporary element to parse raw HTML & extract scripts
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = codeToRender;

      // Extract all script elements
      const scripts = Array.from(tempDiv.querySelectorAll('script'));
      
      // Remove scripts from tempDiv so we don't duplicate them
      scripts.forEach((s) => s.parentNode?.removeChild(s));

      // Append remaining HTML (e.g. iframes, images, divs, a tags)
      while (tempDiv.firstChild) {
        container.appendChild(tempDiv.firstChild);
      }

      // Re-create and execute scripts in the DOM context
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.src) {
          newScript.src = oldScript.src;
          newScript.async = true;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        container.appendChild(newScript);
      });
    } catch (err) {
      console.warn(`Ad render error for ${placementKey}:`, err);
    }
  }, [isEnabled, codeToRender, placementKey]);

  if (!isEnabled || !codeToRender.trim()) {
    if (forceShow) {
      return (
        <div
          className={`ad-slot-container my-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 p-4 text-center text-xs text-slate-400 ${className}`}
          style={{ minHeight }}
        >
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">[ Ad Slot: {placementKey} ]</span>
          <p className="mt-1 text-slate-400">Paste your Adsterra code in Admin Panel &gt; Advertisement Manager to activate this slot.</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`ad-wrapper my-4 flex flex-col items-center justify-center ${className}`}>
      <span className="mb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className="ad-slot-container w-full max-w-4xl overflow-hidden rounded-lg bg-slate-100/50 dark:bg-slate-800/40 p-1 text-center"
        style={{ minHeight }}
      />
    </div>
  );
};
