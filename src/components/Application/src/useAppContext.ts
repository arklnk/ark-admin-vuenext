import type { Ref, InjectionKey } from 'vue'
import { createContext, useContext } from '/@/composables/core/useContext'

export interface AppProviderContextProps {
  prefixCls: Ref<string>
  isMobile: Ref<boolean>
}

const key: InjectionKey<AppProviderContextProps> = Symbol()

// use like element-plus handle
// this is meant to fix global methods like `ElMessage(opts)`, this way we can inject current locale
// into the component as default injection value.
// refer to: https://github.com/element-plus/element-plus/issues/2610#issuecomment-887965266
let appGlobalConfig: AppProviderContextProps | null = null

export function createAppProviderContext(context: AppProviderContextProps) {
  const { state } = createContext<AppProviderContextProps>(context, key)
  // global init
  appGlobalConfig = state
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key, appGlobalConfig)
}
