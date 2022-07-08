<template>
  <ElDivider />
  <ElButton type="danger" class="w-full" :icon="IconFoundationRefresh" @click="handleResetSetting">
    重置
  </ElButton>
</template>

<script setup lang="ts">
import IconFoundationRefresh from '~icons/foundation/refresh'
import { useAppStore } from '/@/stores/modules/app'
import defaultSetting from '/@/settings/projectSetting'
import { useMessage } from '/@/composables/web/useMessage'
import { updateGrayMode } from '/@/logics/theme/updateGrayMode'
import { updateColorWeak } from '/@/logics/theme/updateColorWeak'
import { updateTheme } from '/@/logics/theme/updateTheme'
import { updateSidebarBgColor, updateHeaderBgColor } from '/@/logics/theme/updateBackground'

const appStore = useAppStore()
const { createMessage } = useMessage()
function handleResetSetting() {
  try {
    appStore.setProjectConfig(defaultSetting)
    const {
      grayMode,
      colorWeak,
      themeColor,
      headerSetting: { bgColor: headerBgColor },
      menuSetting: { bgColor: sidebarBgColor },
    } = defaultSetting

    updateGrayMode(grayMode)
    updateColorWeak(colorWeak)
    updateTheme(themeColor)
    updateHeaderBgColor(headerBgColor)
    updateSidebarBgColor(sidebarBgColor)

    createMessage({
      type: 'success',
      message: '重置成功',
    })
  } catch (e) {
    createMessage({
      type: 'error',
      message: '重置失败',
    })
  }
}
</script>
