import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                main: resolve(import.meta.dirname, 'index.html'),
                nested: resolve(import.meta.dirname, 'pages/playlist.html'),
            }
        }
    }
});
