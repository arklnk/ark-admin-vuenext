import { defineConfig } from 'vite'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import windicss from 'vite-plugin-windicss'

import { dependencies, devDependencies, version } from './package.json'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// inject info
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, version },
  // lastBuildTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = parseInt(process.env.port || process.env.npm_config_port || '9528')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue(), windicss(), vueJsx(), Icons({ compiler: 'vue3' })],
    base: '/',
    root: process.cwd(),
    resolve: {
      alias: [
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },

    server: {
      host: true,
      open: true,
      port,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:7001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        ws: {
          target: 'http://127.0.0.1:7002',
          changeOrigin: true,
          ws: true,
        },
      },
    },

    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'static',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: mode === 'production',
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },

    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})
