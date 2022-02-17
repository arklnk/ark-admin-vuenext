export {}

declare global {
  const __APP_INFO__: {}

  interface ViteEnv {
    VITE_APP_BASE_API: string
    VITE_APP_BASE_SOCKET_PATH: string
    VITE_APP_BASE_SOCKET_NSP: string
    VITE_APP_TITLE: string
  }
}
