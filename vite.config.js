import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Only this checkout's own .worktrees folder; a path match would also ignore a checkout that lives inside one.
const worktrees = fileURLToPath(new URL('./.worktrees/', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    watch: { ignored: [`${worktrees}**`] },
  },
  test: {
    exclude: [...configDefaults.exclude, '.worktrees/**'],
  },
});
