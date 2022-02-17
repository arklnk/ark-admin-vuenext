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
  lastBuildTime: new Date(),
}

/**
 * package env type
 */
function packageEnv(mode: string, root: string): ViteEnv {
  const ret: any = {}
  const envConf = loadEnv(mode, root)

  Object.keys(envConf).forEach((envName) => {
    let conf: unknown = envConf[envName]

    // format port to number
    if (envName === 'VITE_PORT') {
      conf = Number(conf)
    }

    ret[envName] = conf
  })

  return ret
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const isBuild = command === 'build'

  const env = packageEnv(mode, root)
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

    server: createViteProxy(env),

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
