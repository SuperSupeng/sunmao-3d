import posthog from 'posthog-js';

const key = `${import.meta.env.VITE_PUBLIC_POSTHOG_KEY || ''}`.trim();
const host = `${import.meta.env.VITE_PUBLIC_POSTHOG_HOST || ''}`.trim() || 'https://us.i.posthog.com';

let ready = false;

export function pagePath() {
  return `${location.pathname}${location.search}${location.hash}`;
}

export function initAnalytics() {
  if (ready || !key) return;
  try {
    posthog.init(key, {
      api_host: host,
      defaults: '2025-05-24',
      autocapture: true,
      // history_change watches the pathname only. This app routes with #/dayun.
      capture_pageview: { path: true, hash: true },
      person_profiles: 'identified_only',
    });
    ready = true;
  } catch (error) {
    console.error('PostHog init failed:', error);
  }
}

export function capture(event, properties, options) {
  if (!ready) return;
  posthog.capture(event, properties, options);
}
