import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.legeai-informatique.fr',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // CSRF gere au niveau applicatif (cf src/lib/security.ts checkOrigin avec allowlist).
  // Le check natif d'Astro est desactive car il echoue derriere un reverse proxy :
  // le navigateur envoie Origin: https://... mais Astro recoit la requete en HTTP via NPM,
  // donc il considere a tort que c'est cross-origin et rejette les POST de formulaire.
  security: {
    checkOrigin: false,
  },
});
