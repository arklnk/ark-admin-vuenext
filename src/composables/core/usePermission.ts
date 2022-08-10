import { intersection } from 'lodash-es'
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
   * @param nor 权限值为数组时生效，如果当前为true，那么权限需要全部满足，即且关系，否则为或者关系满足其一则全部满足
   * @returns
   */
  function hasPermission(values?: RoleEnum | RoleEnum[] | string | string[], nor = true): boolean {
    if (!values) {
      return false
    }

    const mode = projectSetting.permissionMode

    // 角色权限模式
    if (mode === PermissionModeEnum.ROLE) {
      const perms = values as RoleEnum | RoleEnum[]
      if (!Array.isArray(perms)) {
        return userStore.getRoleList.includes(perms)
      }
      // return perms.some((v) => userStore.getRoleList.includes(v))
      const include = intersection(perms, userStore.getRoleList).length

      return nor ? include > 0 : include === perms.length
    }

    // 后端权限模式
    if (mode === PermissionModeEnum.BACK) {
      const perms = values as string | string[]
      if (!Array.isArray(perms)) {
        return permissionStore.getPermissionList.includes(perms)
      }
      // return perms.some((v) => permissionStore.getPermissionList.includes(v))

      const include = intersection(perms, permissionStore.getPermissionList).length

      return nor ? include > 0 : include === perms.length
    }

    return false
  }

  return {
    hasPermission,
    resume,
  }
}
