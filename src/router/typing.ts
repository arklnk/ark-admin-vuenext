import type { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface Menu {
  createdAt: string
  updatedAt: string
  id: number
  parentId?: number
  name: string
  router: string
  // perms: string
  type: number
  icon: string
  orderNum?: number
  viewPath?: string
  keepalive?: boolean
  isShow?: boolean
  children?: Menu[]
}
