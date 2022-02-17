import type { ServerOptions } from 'vite'

export function createViteProxy(env: ViteEnv): ServerOptions {
  const { VITE_PORT } = env
  return {
    host: true,
    open: true,
    port: VITE_PORT,
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
  }
}
