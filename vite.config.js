import { defineConfig } from 'vite';
import { seoLandings } from './seo/plugin.js';

export default defineConfig({
  plugins: [seoLandings()],
});
