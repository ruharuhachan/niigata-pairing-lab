import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import process from 'node:process';

const site = process.env.SITE_URL ?? 'https://ruharuhachan.github.io';
const base = process.env.BASE_PATH ?? '/niigata-pairing-lab';

export default defineConfig({
  site,
  base,
  output: 'static',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/'),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
