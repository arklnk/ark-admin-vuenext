import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'

import { createViteProxy } from './build/proxy'
import { createVitePlugins } from './build/plugin'

import { dependencies, devDependencies, version } from './package.json'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// inject info
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, version },
  // lastBuildTime: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const isBuild = command === 'build'

  const env = loadEnv(mode, root) as unknown as ViteEnv
  return {
    plugins: createVitePlugins(env, isBuild),
    base: '/',
    root,
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

    server: createViteProxy(),

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
