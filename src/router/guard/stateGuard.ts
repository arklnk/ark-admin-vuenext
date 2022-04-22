import type { Router } from 'vue-router'
import { PageEnum } from '/@/enums/pageEnum'
import { usePermissionStore } from '/@/stores/modules/permission'
import { useUserStore } from '/@/stores/modules/user'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // 进入登录页面后确保清除所有信息
    if (to.path === PageEnum.Login) {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()

      userStore.resetState()
      permissionStore.resetState()
    }
  })
}
