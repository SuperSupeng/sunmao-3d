import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, pageFile, renderPage, renderRobots, renderSitemap } from './landings.js';
import { assertSeo } from './check.js';

const cssPath = fileURLToPath(new URL('./landing.css', import.meta.url));

function normalize(url = '/') {
  const pathOnly = decodeURIComponent(url.split('?')[0] || '/');
  if (pathOnly === '/sitemap.xml' || pathOnly === '/robots.txt' || pathOnly === '/seo/landing.css') return pathOnly;
  let pagePath = pathOnly;
  if (pagePath.endsWith('.html')) pagePath = pagePath.slice(0, -'.html'.length);
  if (pagePath.length > 1 && pagePath.endsWith('/')) pagePath = pagePath.slice(0, -1);
  return pagePath || '/';
}

function respond(req, res, hit) {
  const types = {
    html: 'text/html; charset=utf-8',
    xml: 'application/xml; charset=utf-8',
    txt: 'text/plain; charset=utf-8',
    css: 'text/css; charset=utf-8',
  };
  if (hit.redirect) {
    res.statusCode = 308;
    res.setHeader('Location', hit.redirect);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Redirecting to ${hit.redirect}\n`);
    return;
  }
  const body = Buffer.from(hit.body);
  res.statusCode = 200;
  res.setHeader('Content-Type', types[hit.type]);
  res.setHeader('Content-Length', body.length);
  if (req.method === 'HEAD') res.end();
  else res.end(body);
}

function match(url) {
  const raw = decodeURIComponent((url || '/').split('?')[0] || '/');
  const key = normalize(url);
  if (key === '/sitemap.xml') return { type: 'xml', body: renderSitemap() };
  if (key === '/robots.txt') return { type: 'txt', body: renderRobots() };
  if (key === '/seo/landing.css') return { type: 'css', body: fs.readFileSync(cssPath) };
  const page = pages.find(item => item.path === key);
  if (!page) return null;
  const aliased = raw !== page.path;
  if (aliased) return { redirect: page.path };
  return { type: 'html', body: renderPage(page) };
}

function attach(server) {
  server.middlewares.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const hit = match(req.url || '/');
    if (!hit) return next();
    respond(req, res, hit);
  });
}

export function seoLandings() {
  assertSeo();
  return {
    name: 'guanmu-seo-landings',
    configureServer: attach,
    configurePreviewServer: attach,
    generateBundle() {
      const css = fs.readFileSync(cssPath);
      this.emitFile({ type: 'asset', fileName: 'seo/landing.css', source: css });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: renderRobots() });
      for (const page of pages) {
        this.emitFile({ type: 'asset', fileName: pageFile(page), source: renderPage(page) });
      }
    },
    writeBundle(options) {
      const outDir = options.dir;
      if (!outDir) return;
      const read = name => fs.readFileSync(path.join(outDir, name), 'utf8');
      if (read('sitemap.xml') !== renderSitemap()) throw new Error('dist/sitemap.xml drifted from the generator');
      if (read('robots.txt') !== renderRobots()) throw new Error('dist/robots.txt drifted from the generator');
      if (read('seo/landing.css') !== fs.readFileSync(cssPath, 'utf8')) throw new Error('dist/seo/landing.css drifted');
      for (const page of pages) {
        const name = pageFile(page);
        if (read(name) !== renderPage(page)) throw new Error(`dist/${name} drifted from the generator`);
      }
    },
  };
}
