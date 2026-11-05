import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, pages, pageFile, renderPage, renderRobots, renderSitemap } from './landings.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const LOCKED = [
  ['/dayun', '大云院 · 交互学习入口'],
  ['/mituo-dian', '弥陀殿 · 故事与拆解'],
  ['/dougong', '斗栱是什么 · 从大斗学起'],
  ['/components', '古建筑构件入门 · 以大云院为例'],
  ['/shanxi-ancient-architecture', '山西古建筑怎么看 · 大云院样例'],
  ['/en/dougong', 'What is dougong · learn from a Chinese wooden hall'],
  ['/en/chinese-wooden-architecture', 'Chinese wooden architecture · a walkthrough of Dayun Temple'],
  ['/en/dayun-temple', 'Dayun Temple · Amitabha Hall interactive guide'],
  ['/pupai-fang', '普拍枋是什么 · 作用与怎么看'],
  ['/lan-e', '阑额是什么 · 作用与怎么看'],
];

function fail(message) {
  throw new Error(`seo check: ${message}`);
}

export function assertSeo() {
  if (pages.length !== LOCKED.length) fail(`expected ${LOCKED.length} pages, found ${pages.length}`);
  const seen = new Set();
  for (const [index, [lockedPath, lockedTitle]] of LOCKED.entries()) {
    const page = pages[index];
    if (page.path !== lockedPath || page.title !== lockedTitle) {
      fail(`page ${index} is ${page.path} / ${page.title}, expected ${lockedPath} / ${lockedTitle}`);
    }
    if (seen.has(page.path)) fail(`duplicate path ${page.path}`);
    seen.add(page.path);
    if (!page.lead || page.lead.length < 40) fail(`lead too short: ${page.path}`);
    if (!page.sections?.length) fail(`no sections: ${page.path}`);
    const html = renderPage(page);
    const h1 = `<h1>${page.title}</h1>`;
    if (!html.includes(`<title>${page.title}</title>`)) fail(`title tag: ${page.path}`);
    if (!html.includes(h1) || html.split('<h1>').length !== 2) fail(`h1: ${page.path}`);
    if (!html.includes(`<p class="lead">`)) fail(`lead element: ${page.path}`);
    if (!html.includes(page.lead)) fail(`lead text not in body: ${page.path}`);
    const h1At = html.indexOf(h1);
    const leadAt = html.indexOf('class="lead"');
    if (h1At < 0 || leadAt < h1At) fail(`lead is not after h1: ${page.path}`);
    if (!html.includes(`<link rel="canonical" href="${SITE}${page.path}" />`)) fail(`canonical link: ${page.path}`);
    const modelLink = page.lang === 'en' ? 'href="/?lang=en#/dayun"' : 'href="/#/dayun"';
    if (!html.includes(modelLink)) fail(`interactive link: ${page.path}`);
    if (page.lang === 'en' && html.includes('href="/#/dayun"')) fail(`english page links to the Chinese-only model: ${page.path}`);
    if (page.lang === 'en' && /The 3D (labels|screen) (are|is) in Chinese/.test(html)) fail(`english page still says the model is Chinese-only: ${page.path}`);
    if (page.path === '/en/dougong' && !html.includes('Dougong close-up')) fail('dougong page missing English click path');
    if (page.path === '/en/dougong' && !html.includes('Start from this dou')) fail('dougong page missing start label');
    if (page.path === '/en/dougong' && !html.includes('Bottom large dou')) fail('dougong page missing sample title');
    if (page.lang === 'zh-CN' && !html.includes('测绘复原')) fail(`missing teaching caveat: ${page.path}`);
    if (page.lang === 'en' && !html.includes('not a measured')) fail(`missing teaching caveat: ${page.path}`);
    if (page.lang === 'en' && !html.includes('English path you can finish')) fail(`missing English path: ${page.path}`);
  }

  const sitemap = renderSitemap();
  if (sitemap.includes('#')) fail('sitemap must not list hash routes');
  if (!sitemap.includes(`<loc>${SITE}/</loc>`)) fail('sitemap missing home');
  for (const page of pages) {
    if (!sitemap.includes(`<loc>${SITE}${page.path}</loc>`)) fail(`sitemap missing ${page.path}`);
  }

  const robots = renderRobots();
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots missing sitemap pointer');
  if (!/^User-agent:\s*\*/m.test(robots)) fail('robots missing user-agent');
  if (!robots.includes('Allow: /')) fail('robots does not allow crawling');
  for (const page of pages) {
    if (!robots.includes(`Allow: ${page.path}`)) fail(`robots missing ${page.path}`);
  }

  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const rewrites = vercel.rewrites || [];
  const redirects = vercel.redirects || [];
  const catchAll = rewrites.at(-1);
  if (catchAll?.source !== '/(.*)' || catchAll?.destination !== '/index.html') {
    fail('last rewrite must keep the SPA fallback');
  }
  for (const page of pages) {
    const rewrite = rewrites.find(rule => rule.source === page.path && rule.destination === `/${pageFile(page)}`);
    if (!rewrite) fail(`vercel rewrite missing for ${page.path} -> /${pageFile(page)}`);
    const slash = redirects.find(rule => rule.source === `${page.path}/` && rule.destination === page.path);
    const html = redirects.find(rule => rule.source === `${page.path}.html` && rule.destination === page.path);
    if (!slash) fail(`vercel trailing-slash redirect missing for ${page.path}`);
    if (!html) fail(`vercel .html redirect missing for ${page.path}`);
    if (rewrites.findIndex(rule => rule.source === page.path) > rewrites.indexOf(catchAll)) {
      fail(`rewrite for ${page.path} is after the SPA fallback`);
    }
  }
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  assertSeo();
  console.log(`seo check ok: ${pages.length} pages, sitemap, robots, vercel routes`);
}
