// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alice-agent.stuko.dev',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  },
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/api/') && !page.includes('/tags/'),
    }),
  ],
  prefetch: true,
  viewTransitions: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'it'],
    routing: {
      prefixDefaultLocale: true
    }
  }
});