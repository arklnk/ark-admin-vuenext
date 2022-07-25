import type { InjectionKey } from 'vue'
import { createContext, useContext } from '/@/composables/core/useContext'

export interface BasicFormContextProps {
  submitAction: () => Promise<void>
  resetAction: () => Promise<void>
}

const formKey: InjectionKey<BasicFormContextProps> = Symbol()

export function createFormContext(context: BasicFormContextProps) {
  return createContext(context, formKey)
}

export function useFormContext() {
  return useContext<BasicFormContextProps>(formKey)
}
