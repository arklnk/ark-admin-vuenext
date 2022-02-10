import type { ServerOptions } from 'vite'

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = parseInt(process.env.port || process.env.npm_config_port || '9528')

export function createViteProxy(): ServerOptions {
  return {
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
  }
}
