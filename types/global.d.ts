import type { PropType as VuePropType, VNodeChild, ComputedRef, Ref } from 'vue'

declare global {
  const __APP_INFO__: {
    pkg: {
      version: string
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    lastBuildTime: string
  }

  declare interface ViteEnv {
    VITE_PORT: number
    VITE_APP_BASE_API: string
    VITE_PROXY_API_TARGET: string
  }

  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element
  declare type RefableProps<T> = {
    [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>
  }

  declare type Nullable<T> = T | null | undefined
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }
  declare type Arrayable<T> = T | T[]

  /**
   * Recursive `Partial<T>`.
   */
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
}
