import 'vue-router'
import { defineComponent } from 'vue'
import { RouterTransitionEnum } from '/@/enums/appEnum'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

// backend menu obj type
export interface Menu {
  createdAt: string
  updatedAt: string
  id: number
  parentId: number
  name: string
  router: string
  perms: string
  type: number
  icon: string
  orderNum: number
  viewPath: string
  keepalive: boolean
  isShow: boolean
}

/**
 * 扩展RouteMeta属性
 */
declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    /**
     * @description if true, not show in sidebar menu
     * @default false
     */
    hidden?: boolean

    /**
     * @description sidebar menu name
     */
    title?: string

    /**
     * @description icon name
     */
    icon?: string

    /**
     * @description keep alive
     * @default true
     */
    noCache?: boolean

    /**
     * @description if false, not show in breadcrumb
     * @default true
     */
    breadcrumb?: boolean

    /**
     * @description affix tag view
     * @default false
     */
    affix?: boolean

    /**
     * @description page transition enum
     */
    transitionName?: RouterTransitionEnum

    /**
     * @description iframe src
     */
    iframeSrc?: string
  }
}
