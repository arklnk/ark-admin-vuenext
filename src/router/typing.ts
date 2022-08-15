import type { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface Menu {
  id: number
  parentId?: number
  name: string
  router: string
  type: number
  icon: string
  orderNum?: number
  viewPath?: string
  isShow?: boolean
  activeRouter?: string
  children?: Menu[]
}
