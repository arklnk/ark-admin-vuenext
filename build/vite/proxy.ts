import type { ServerOptions } from 'vite'

export function createViteProxy(env: ViteEnv): ServerOptions {
  const { VITE_PORT, VITE_PROXY_API_TARGET } = env
  return {
    host: true,
    open: true,
    port: VITE_PORT,
    proxy: {
      '/api': {
        target: VITE_PROXY_API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
}
