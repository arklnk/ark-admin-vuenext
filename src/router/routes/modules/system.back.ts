import { defineBackModule } from '/@/router/helper/defineModule'

/**
 * 系统模块
 */
export default defineBackModule({
  'views/system/permission/menu': () => import('/@/views/system/permission/menu/index.vue'),
  'views/system/permission/user': () => import('/@/views/system/permission/user/index.vue'),
})
