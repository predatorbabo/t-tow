import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Create an object that only contains the environment variables that are safe to expose to the client.
  const envForClient = {
    'process.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY),
  };

  return {
    define: envForClient,
    server: {
      port: Number(env.PORT) || 3000,
      host: '0.0.0.0',
    },
    preview: {
      port: Number(env.PORT) || 8080,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
