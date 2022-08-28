<template>
  <ElDivider />
  <ElButton type="danger" class="w-full" @click="handleResetSetting">
    {{ t('layout.setting.reset') }}
  </ElButton>
</template>

<script setup lang="ts">
import { useAppStore } from '/@/stores/modules/app'
import defaultSetting from '/@/settings/projectSetting'
import { useMessage } from '/@/composables/web/useMessage'
import { updateGrayMode } from '/@/logics/theme/updateGrayMode'
import { updateColorWeak } from '/@/logics/theme/updateColorWeak'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()
const appStore = useAppStore()
const { createMessage } = useMessage()
function handleResetSetting() {
  try {
    appStore.setProjectConfig(defaultSetting)
    const { grayMode, colorWeak } = defaultSetting

    updateGrayMode(grayMode)
    updateColorWeak(colorWeak)
    // updateTheme(themeColor)
    // updateHeaderBgColor(headerBgColor)
    // updateSidebarBgColor(sidebarBgColor)

    createMessage({
      type: 'success',
      message: t('layout.setting.resetSuccess'),
    })
  } catch (e) {
    console.error(e)
  }
}
</script>
