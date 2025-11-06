import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

const devHost = process.env.VITE_DEV_HOST || '0.0.0.0'
const devPort = Number(process.env.VITE_DEV_PORT || 8443)

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: devPort,
        host: devHost,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, './src/server/server.key')),
            cert: fs.readFileSync(path.resolve(__dirname, './src/server/server.crt')),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
})
