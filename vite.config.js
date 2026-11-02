import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom', // ODER 'happy-dom'
        globals: true,
        base: "/Titocci-Metalcostruzioni-SAGL-Website-/",
        setupFiles: ['./src/setupTests.js'], // Pfad zu deiner Setup-Datei
    },
});