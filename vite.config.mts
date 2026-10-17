import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html'),
                agenda: resolve(import.meta.dirname, 'pages/agenda.html'),
                playlist: resolve(import.meta.dirname, 'pages/playlist.html'),
            }
        }
    }
});
