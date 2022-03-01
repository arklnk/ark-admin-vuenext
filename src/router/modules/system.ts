import { defineRouteModule } from '/@/router/routeHelper'

/**
 * 系统模块
 */
export default defineRouteModule({
  'views/system/permission/menu': () => import('/@/views/system/permission/menu/index.vue'),
  'views/system/permission/user': () => import('/@/views/system/permission/user/index.vue'),
})
