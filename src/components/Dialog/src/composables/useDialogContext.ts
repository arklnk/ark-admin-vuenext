import type { InjectionKey, Ref } from 'vue'

import { createContext, useContext } from '/@/composables/core/useContext'

export interface DialogContextProps {
  visibleRef: Ref<boolean>
}

const key: InjectionKey<DialogContextProps> = Symbol()

export function createDialogContext(ctx: DialogContextProps) {
  return createContext<DialogContextProps>(ctx, key)
}

export function useDialogContext() {
  return useContext<DialogContextProps>(key)
}
