import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

export default defineConfig(async () => {
  const { getViteConfig } = await import('astro/config');
  const astroConfig = await getViteConfig({});

  return {
    ...astroConfig,
    resolve: {
      alias: {
        src: fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
