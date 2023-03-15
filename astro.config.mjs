import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/calculate-reading-time.mjs';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';
import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    mdx(),
    prefetch(),
  ],
  vite: {
    define: {
      'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    },
  },
  output: 'server',
  experimental: {
    contentCollections: true,
  },
  adapter: vercel({
    analytics: true,
  }),
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  site: 'https://www.thomasledoux.be',
});
