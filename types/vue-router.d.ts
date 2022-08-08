import type { RouterTransitionEnum } from '/@/enums/appEnum'
import type { RoleEnum } from '/@/enums/roleEnum'

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

    /**
     * @description role info
     */
    roles?: RoleEnum[]

    /**
     * @description current active menu
     */
    currentActiveMenu?: string

    /**
     * @description used internally to mark single-level menus
     */
    single?: boolean

    /**
     * @description ignore route, only build for BACK mode
     */
    ignoreRoute?: boolean
  }
}
