import type { InjectionKey, Ref } from 'vue'

import { createContext, useContext } from '/@/composables/core/useContext'

export interface DialogContextProps {
  visibleRef: Ref<boolean>
}

const key: InjectionKey<DialogContextProps> = Symbol()

export function createDialogContext(context: DialogContextProps) {
  return createContext<DialogContextProps>(context, key)
}

export function useDialogContext() {
  return useContext<DialogContextProps>(key)
}
