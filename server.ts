import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import { store, DEFAULT_ADS, DEFAULT_TOOLS, ToolConfig } from './server/store.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple in-memory session tokens for the single admin
const validTokens = new Set<string>();

function generateToken(): string {
  const token = 'adm_' + crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  return token;
}

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing admin token' });
  }
  const token = authHeader.substring(7);
  if (!validTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
  next();
}

// ---------------- PUBLIC API ROUTES ----------------

// Public Site Settings
app.get('/api/public/settings', (_req: Request, res: Response) => {
  const settings = store.getSettings();
  // Strip password hash from public response
  const { adminPasswordHash, adminUsername, ...safeSettings } = settings;
  res.json(safeSettings);
});

// Public Active Ads
app.get('/api/public/ads', (_req: Request, res: Response) => {
  const ads = store.getAds();
  res.json(ads);
});

// Public SEO Settings
app.get('/api/public/seo', (_req: Request, res: Response) => {
  const seo = store.getSeo();
  res.json(seo);
});

// Public Tools Configuration
app.get('/api/public/tools', (_req: Request, res: Response) => {
  const tools = store.getTools();
  res.json(Object.values(tools));
});

// Public Analytics Ping
app.post('/api/public/analytics/event', (req: Request, res: Response) => {
  const { slug } = req.body || {};
  store.recordPageView(slug);
  res.json({ success: true });
});

// Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body || {};
  const settings = store.getSettings();

  const isUserValid =
    typeof username === 'string' &&
    username.trim().toLowerCase() === settings.adminUsername.toLowerCase();

  if (isUserValid && typeof password === 'string' && store.verifyAdminPassword(password)) {
    const token = generateToken();
    return res.json({
      success: true,
      token,
      user: { username: settings.adminUsername },
    });
  }

  return res.status(401).json({ error: 'Invalid admin username or password' });
});

// Admin Token Verification
app.get('/api/auth/check', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (validTokens.has(token)) {
      return res.json({ authenticated: true, user: { username: store.getSettings().adminUsername } });
    }
  }
  return res.status(401).json({ authenticated: false });
});

// ---------------- PROTECTED ADMIN API ROUTES ----------------

// Admin Dashboard Overview
app.get('/api/admin/overview', adminAuthMiddleware, (_req: Request, res: Response) => {
  const data = store.getData();
  const ads = Object.values(data.ads);
  const activeAds = ads.filter((a) => a.enabled && a.code.trim().length > 0).length;
  const tools = Object.values(data.tools);
  const activeTools = tools.filter((t) => t.enabled).length;

  res.json({
    totalViews: data.analytics.totalViews,
    dailyViews: data.analytics.dailyViews,
    toolUsage: data.analytics.toolUsage,
    recentEvents: data.analytics.recentEvents.slice(0, 15),
    totalAds: ads.length,
    activeAds,
    totalTools: tools.length,
    activeTools,
  });
});

// Admin Get Ads
app.get('/api/admin/ads', adminAuthMiddleware, (_req: Request, res: Response) => {
  res.json(store.getAds());
});

// Admin Update Ads (Batch or Single)
app.put('/api/admin/ads', adminAuthMiddleware, (req: Request, res: Response) => {
  const newAds = req.body;
  if (!newAds || typeof newAds !== 'object') {
    return res.status(400).json({ error: 'Invalid ads data' });
  }
  store.updateAds(newAds);
  res.json({ success: true, ads: store.getAds() });
});

// Admin Get Settings
app.get('/api/admin/settings', adminAuthMiddleware, (_req: Request, res: Response) => {
  const settings = store.getSettings();
  const { adminPasswordHash, ...safe } = settings;
  res.json(safe);
});

// Admin Update Settings
app.put('/api/admin/settings', adminAuthMiddleware, (req: Request, res: Response) => {
  const { newPassword, ...settingsToUpdate } = req.body;
  if (newPassword && typeof newPassword === 'string' && newPassword.length >= 6) {
    store.setAdminPassword(newPassword);
  }
  store.updateSettings(settingsToUpdate);
  res.json({ success: true, message: 'Settings saved successfully' });
});

// Admin Get SEO
app.get('/api/admin/seo', adminAuthMiddleware, (_req: Request, res: Response) => {
  res.json(store.getSeo());
});

// Admin Update SEO
app.put('/api/admin/seo', adminAuthMiddleware, (req: Request, res: Response) => {
  store.updateSeo(req.body);
  res.json({ success: true, seo: store.getSeo() });
});

// Admin Get Tools
app.get('/api/admin/tools', adminAuthMiddleware, (_req: Request, res: Response) => {
  res.json(store.getTools());
});

// Admin Update Tools
app.put('/api/admin/tools', adminAuthMiddleware, (req: Request, res: Response) => {
  store.updateTools(req.body);
  res.json({ success: true, tools: store.getTools() });
});

// ---------------- ROBOTS.TXT & SITEMAP.XML ----------------

app.get('/robots.txt', (_req: Request, res: Response) => {
  const seo = store.getSeo();
  res.type('text/plain');
  res.send(seo.robotsSettings || 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://unmokto.com/sitemap.xml');
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const baseUrl = process.env.APP_URL || 'https://unmokto.com';
  const tools = Object.values(store.getTools()).filter((t) => t.enabled);
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/category/image`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/category/pdf`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/category/video`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/category/text`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/category/calculator`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy-policy`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${baseUrl}/terms-of-service`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${baseUrl}/disclaimer`, priority: '0.4', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n    <loc>${page.loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  }

  for (const tool of tools) {
    xml += `  <url>\n    <loc>${baseUrl}/tools/${tool.slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// ---------------- VITE / STATIC INTEGRATION ----------------

async function startServer() {
  if (!isProduction) {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Unmokto Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
