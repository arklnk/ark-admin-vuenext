export {}

declare global {
  const __APP_INFO__: {
    pkg: {
      version: string
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    lastBuildTime: string
  }

  interface ViteEnv {
    VITE_PORT: number
    VITE_APP_BASE_API: string
    VITE_APP_BASE_SOCKET_PATH: string
    VITE_APP_BASE_SOCKET_NSP: string
    VITE_APP_TITLE: string
    VITE_PROXY_API_TARGET: string
    VITE_PROXY_WS_TARGET: string
  }

  type Nullable<T> = T | null | undefined
}
