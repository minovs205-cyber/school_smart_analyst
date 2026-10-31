// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://minovs205-cyber.github.io',
  base: '/school_smart_analyst',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
