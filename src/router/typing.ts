import type { defineComponent } from 'vue'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface Menu {
  id: number
  parent_id?: number
  name: string
  router: string
  type: number
  icon: string
  order_num?: number
  view_path?: string
  is_show?: boolean
  active_router?: string
  children?: Menu[]
}
