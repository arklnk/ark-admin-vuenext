import { PermissionModeEnum } from '/@/enums/appEnum'
import { RoleEnum } from '/@/enums/roleEnum'

import projectSetting from '/@/settings/projectSetting'
import { useUserStore } from '/@/stores/modules/user'

export function usePermission() {
  const userStore = useUserStore()

  /**
   * 检测是否有权限
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    if (!value) {
      return def
    }
    // TODO
    return false
  }

  function changeRole(roles: RoleEnum | RoleEnum[]) {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROLE) {
      throw new Error(
        'Please switch PermissionModeEnum to ROLE mode in the configuration to operate!'
      )
    }

    if (!Array.isArray(roles)) {
      roles = [roles]
    }
    userStore.setRoleList(roles)
  }

  return {
    hasPermission,
    changeRole,
  }
}
