import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/Titocci-Metalcostruzioni-SAGL-Website-/', // Exakter Name des GitHub Repositories
})