<template>
  <span :class="$attrs.class" class="inline-block" @click="handleClick">
    <IconSettings />
  </span>
  <ElDrawer v-model="visibleRef" direction="rtl" title="项目配置" :size="300" append-to-body>
    <div class="w-full overflow-hidden">
      <ElDivider>系统主题</ElDivider>
      <ThemeColorPicker :color-list="APP_PRESET_COLOR_LIST" :cursor="getThemeColor" />
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSettings from '~icons/icon-park-outline/config'
import { APP_PRESET_COLOR_LIST } from '/@/settings/designSetting'

import ThemeColorPicker from './components/ThemeColorPicker.vue'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const visibleRef = ref(false)
function handleClick() {
  visibleRef.value = true
}

const { getThemeColor } = useRootSetting()
</script>
