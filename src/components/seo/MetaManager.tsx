import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

interface MetaManagerProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  schema?: object;
}

export const MetaManager: React.FC<MetaManagerProps> = ({
  title,
  description,
  canonicalPath,
  schema,
}) => {
  const { settings, seo } = useApp();

  useEffect(() => {
    // 1. Title
    const siteName = settings.siteName || 'Unmokto';
    const finalTitle = title ? `${title} – ${siteName}` : seo.homepageTitle || `${siteName} – Free Online Tools for Everyone`;
    document.title = finalTitle;

    // 2. Meta description
    const finalDesc = description || seo.homepageMetaDescription || 'Free Online Tools for Everyone - Compress images, convert files, create QR codes, and more.';
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', finalDesc);

    // 3. OpenGraph tags
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('og:title', finalTitle);
    setMetaTag('og:description', finalDesc);
    const origin = window.location.origin;
    const fullUrl = `${origin}${canonicalPath || window.location.pathname}`;
    setMetaTag('og:url', fullUrl);
    setMetaTag('og:site_name', siteName);

    // 4. Twitter tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setTwitterTag('twitter:title', finalTitle);
    setTwitterTag('twitter:description', finalDesc);

    // 5. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Dynamic Favicon
    if (settings.faviconUrl) {
      let iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = settings.faviconUrl;
    }

    // 6. Structured data (JSON-LD)
    if (schema) {
      const existingScript = document.getElementById('dynamic-jsonld');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const dynamicScript = document.getElementById('dynamic-jsonld');
      if (dynamicScript) dynamicScript.remove();
    };
  }, [title, description, canonicalPath, schema, settings.siteName, seo.homepageTitle, seo.homepageMetaDescription]);

  return null;
};
