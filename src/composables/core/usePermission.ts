import { isEmpty } from 'lodash-es'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { RoleEnum } from '/@/enums/roleEnum'
import { resetRouter, router } from '/@/router'

import projectSetting from '/@/settings/projectSetting'
import { usePermissionStore } from '/@/stores/modules/permission'
import { useUserStore } from '/@/stores/modules/user'

export function usePermission() {
  const permissionStore = usePermissionStore()
  const userStore = useUserStore()

  async function resume() {
    resetRouter()
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach((route) => router.addRoute(route))
  }

  /**
   * 检查是否具有权限
   * @param values 权限值
   * @param nor and / or 且或非
   * @returns
   */
  function hasPermission(
    values?: RoleEnum | RoleEnum[] | string | string[],
    nor: 'and' | 'or' = 'or'
  ): boolean {
    // 空值跳过权限校验
    if (isEmpty(values)) return true

    const mode = projectSetting.permissionMode

    // 角色权限模式
    if (mode === PermissionModeEnum.ROLE) {
      const perms = values as RoleEnum | RoleEnum[]
      if (!Array.isArray(perms)) {
        return userStore.getRoleList.includes(perms)
      }

      if (nor === 'and') {
        return perms.every((item) => userStore.getRoleList.includes(item))
      } else {
        return perms.some((item) => userStore.getRoleList.includes(item))
      }
    }

    // 后端权限模式
    if (mode === PermissionModeEnum.BACK) {
      const perms = values as string | string[]
      if (!Array.isArray(perms)) {
        return permissionStore.getPermissionList.includes(perms)
      }

      if (nor === 'and') {
        return perms.every((item) => permissionStore.getPermissionList.includes(item))
      } else {
        return perms.some((item) => permissionStore.getPermissionList.includes(item))
      }
    }

    return false
  }

  return {
    hasPermission,
    resume,
  }
}
