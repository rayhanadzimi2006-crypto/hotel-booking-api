import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel([
            'frontend/src/index.css',
            'frontend/src/main.jsx',
        ]),
        tailwindcss(),
    ],
})
