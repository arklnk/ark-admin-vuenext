/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string
  readonly VITE_APP_BASE_SOCKET_PATH: string
  readonly VITE_APP_BASE_SOCKET_NSP: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
