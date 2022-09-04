/**
 * @description default layout
 */
export const ParentLayout = () => import('/@/layouts/default/index.vue')

/**
 * @description iframe layout
 */
export const IFrameLayout = () => import('/@/layouts/iframe/index.vue')

/**
 * @description empty layout
 */
export const EmptyLayout = () => import('/@/layouts/empty/index.vue')

/**
 * @description view exception
 */
export const ViewNotImpl = () => import('/@/views/basic/error/ViewNotImpl.vue')
