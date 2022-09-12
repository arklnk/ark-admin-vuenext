<template>
  <ElDivider />
  <ElButton type="danger" class="w-full" @click="handleResetSetting">
    {{ t('layout.setting.clearCache') }}
  </ElButton>
</template>

<script setup lang="ts">
import { useTransl } from '/@/composables/core/useTransl'
import WebStorage from '/@/utils/cache'

const { t } = useTransl()
function handleResetSetting() {
  try {
    WebStorage.clear()
    window.location.reload()
  } catch (e) {
    console.error(e)
  }
}
</script>
