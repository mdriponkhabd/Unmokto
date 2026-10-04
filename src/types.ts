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
}

export interface SeoSettings {
  homepageTitle: string;
  homepageMetaDescription: string;
  ogImage: string;
  robotsSettings: string;
  customHeaderScripts: string;
  customFooterScripts: string;
}

export type ToolCategory = 'image' | 'pdf' | 'video' | 'text' | 'calculator' | 'utility';

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
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
