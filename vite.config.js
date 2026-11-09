
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/Titocci-Metalcostruzioni-SAGL-Website-/',
    plugins: [react()],

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.js',
        clearMocks: true,
    },


    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    }
})
