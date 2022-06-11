import type { Router } from 'vue-router'
import { useMessage } from '/@/composables/web/useMessage'
import projectSetting from '/@/settings/projectSetting'
import { warn } from '/@/utils/log'

export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting
  const { createMessage, createNotification } = useMessage()

  router.beforeEach(() => {
    try {
      if (closeMessageOnSwitch) {
        createMessage.closeAll()
        createNotification.closeAll()
      }
    } catch (err) {
      warn('MessageGuard Error:' + err)
    }
    return true
  })
}
