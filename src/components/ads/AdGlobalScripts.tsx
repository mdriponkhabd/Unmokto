import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, Sparkles } from 'lucide-react';

export const AdGlobalScripts: React.FC = () => {
  const { ads, settings, seo } = useApp();
  const [smartlinkUrl, setSmartlinkUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Inject Social Bar
    const socialBar = ads['social_bar'];
    if (socialBar && socialBar.enabled && socialBar.code.trim()) {
      try {
        const oldEl = document.getElementById('unmokto-social-bar');
        if (oldEl) oldEl.remove();

        const div = document.createElement('div');
        div.id = 'unmokto-social-bar';
        div.innerHTML = socialBar.code;
        const scripts = Array.from(div.querySelectorAll('script'));
        scripts.forEach((s) => s.parentNode?.removeChild(s));
        document.body.appendChild(div);

        scripts.forEach((s) => {
          const ns = document.createElement('script');
          Array.from(s.attributes).forEach((a) => ns.setAttribute(a.name, a.value));
          if (s.src) ns.src = s.src;
          else ns.textContent = s.textContent;
          document.body.appendChild(ns);
        });
      } catch (e) {
        console.warn('Social bar injection error', e);
      }
    }

    // 2. Inject Popunder
    const popunder = ads['popunder'];
    if (popunder && popunder.enabled && popunder.code.trim()) {
      try {
        const oldEl = document.getElementById('unmokto-popunder');
        if (oldEl) oldEl.remove();

        const div = document.createElement('div');
        div.id = 'unmokto-popunder';
        div.innerHTML = popunder.code;
        const scripts = Array.from(div.querySelectorAll('script'));
        scripts.forEach((s) => s.parentNode?.removeChild(s));
        document.body.appendChild(div);

        scripts.forEach((s) => {
          const ns = document.createElement('script');
          Array.from(s.attributes).forEach((a) => ns.setAttribute(a.name, a.value));
          if (s.src) ns.src = s.src;
          else ns.textContent = s.textContent;
          document.body.appendChild(ns);
        });
      } catch (e) {
        console.warn('Popunder injection error', e);
      }
    }

    // 3. Smartlink Support
    const smartlink = ads['smartlink'];
    if (smartlink && smartlink.enabled && smartlink.code.trim()) {
      const trimmed = smartlink.code.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        setSmartlinkUrl(trimmed);
      } else {
        try {
          const div = document.createElement('div');
          div.id = 'unmokto-smartlink-script';
          div.innerHTML = trimmed;
          const scripts = Array.from(div.querySelectorAll('script'));
          scripts.forEach((s) => s.parentNode?.removeChild(s));
          document.body.appendChild(div);

          scripts.forEach((s) => {
            const ns = document.createElement('script');
            Array.from(s.attributes).forEach((a) => ns.setAttribute(a.name, a.value));
            if (s.src) ns.src = s.src;
            else ns.textContent = s.textContent;
            document.body.appendChild(ns);
          });
        } catch (e) {
          console.warn('Smartlink script error', e);
        }
      }
    } else {
      setSmartlinkUrl(null);
    }

    // 4. Google Analytics
    if (settings.googleAnalyticsId && settings.googleAnalyticsId.trim()) {
      const gaId = settings.googleAnalyticsId.trim();
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);

      const gaInit = document.createElement('script');
      gaInit.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(gaInit);
    }
  }, [ads, settings.googleAnalyticsId]);

  if (smartlinkUrl) {
    return (
      <aside aria-label="Featured recommendation" className="fixed bottom-4 right-4 z-40 animate-bounce">
        <a
          href={smartlinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-transform"
        >
          <Sparkles className="h-4 w-4" />
          <span>Special Offers &amp; Tools</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </aside>
    );
  }

  return null;
};
