// Static reading pages are not the SPA bundle. Vercel serves /_vercel/insights/script.js
// when Web Analytics is enabled. PostHog is injected only when the build has a key.

const vercelInsights = `<script>
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>`;

function posthogSnippet() {
  const key = `${process.env.VITE_PUBLIC_POSTHOG_KEY || ''}`.trim();
  if (!key) return '';
  const host = `${process.env.VITE_PUBLIC_POSTHOG_HOST || ''}`.trim() || 'https://us.i.posthog.com';
  const config = {
    api_host: host,
    defaults: '2025-05-24',
    autocapture: true,
    capture_pageview: true,
    person_profiles: 'identified_only',
  };
  return `<script>
(function () {
  var key = ${JSON.stringify(key)};
  var config = ${JSON.stringify(config)};
  if (!key) return;
  var posthog = window.posthog = window.posthog || [];
  if (!posthog.__SV) {
    posthog._i = posthog._i || [];
    posthog.people = posthog.people || [];
    posthog.init = function (token, options) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.crossOrigin = 'anonymous';
      var apiHost = (options && options.api_host) || 'https://us.i.posthog.com';
      script.src = apiHost.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      ['capture'].forEach(function (method) {
        posthog[method] = function () {
          posthog.push([method].concat([].slice.call(arguments, 0)));
        };
      });
      posthog._i.push([token, options]);
    };
    posthog.__SV = 1;
    posthog.init(key, config);
  }
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[hreflang]');
    if (!link || !window.posthog || !window.posthog.capture) return;
    var to = link.getAttribute('hreflang') === 'en' ? 'en' : 'zh';
    var from = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ? 'en' : 'zh';
    window.posthog.capture('lang_switched', {
      lang: to,
      from: from,
      path: location.pathname + location.search + location.hash,
    }, { send_instantly: true, transport: 'sendBeacon' });
  });
})();
</script>`;
}

export function analyticsMarkup() {
  return `${vercelInsights}${posthogSnippet()}`;
}
