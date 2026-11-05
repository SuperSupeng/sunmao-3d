// English is explicit (?lang=en, including inside the hash) or inherited from an /en/* entry.
// Chinese stays the default. The choice is remembered for this tab so a refresh keeps it.

const STORAGE_KEY = 'guanmu-locale';

function explicitLang() {
  const fromSearch = new URLSearchParams(location.search).get('lang');
  if (fromSearch === 'en' || fromSearch === 'zh') return fromSearch;
  const hash = location.hash;
  const queryAt = hash.indexOf('?');
  if (queryAt === -1) return null;
  const fromHash = new URLSearchParams(hash.slice(queryAt + 1)).get('lang');
  if (fromHash === 'en' || fromHash === 'zh') return fromHash;
  return null;
}

function referrerIsEnglishEntry() {
  if (!document.referrer) return false;
  try {
    const ref = new URL(document.referrer);
    if (ref.origin !== location.origin) return false;
    return ref.pathname === '/en' || ref.pathname.startsWith('/en/');
  } catch {
    return false;
  }
}

function remember(lang) {
  try { sessionStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ }
}

export function detectLocale() {
  const explicit = explicitLang();
  if (explicit) {
    remember(explicit);
    return explicit;
  }
  if (referrerIsEnglishEntry()) {
    remember('en');
    return 'en';
  }
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export const locale = detectLocale();
export const isEn = locale === 'en';

export function localeUrl(hash = location.hash) {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const hashPath = clean.split('?')[0];
  const hashQuery = clean.includes('?') ? new URLSearchParams(clean.slice(clean.indexOf('?') + 1)) : null;
  const params = new URLSearchParams(location.search);
  if (hashQuery) {
    for (const [key, value] of hashQuery) if (!params.has(key)) params.set(key, value);
  }
  if (isEn) params.set('lang', 'en');
  else if (params.get('lang') === 'en') params.delete('lang');
  const search = params.toString();
  const hashOut = hashPath ? `#${hashPath}` : '';
  return `${location.pathname}${search ? `?${search}` : ''}${hashOut}`;
}

export function pinLocaleInUrl() {
  const next = localeUrl();
  const current = `${location.pathname}${location.search}${location.hash}`;
  if (next !== current) history.replaceState(history.state, '', next);
}

export function leaveEnglish() {
  remember('zh');
  const params = new URLSearchParams(location.search);
  params.delete('lang');
  const search = params.toString();
  location.assign(`${location.pathname}${search ? `?${search}` : ''}${location.hash}`);
}
