<template>
  <span class="text-center">
    <ElSwitch
      @change="toggleDarkMode()"
      :active-value="ThemeEnum.DARK"
      :inactive-value="ThemeEnum.LIGHT"
      :active-icon="darkIcon"
      :inactive-icon="lightIcon"
      inline-prompt
      :model-value="getTheme"
      :style="{
        '--el-switch-on-color': '#141414',
        '--el-switch-off-color': '#141414',
      }"
    />
  </span>
</template>

<script setup lang="ts">
import { h, unref } from 'vue'
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground'
import { updateDarkMode } from '/@/logics/theme/updateDarkMode'
import { ThemeEnum } from '/@/enums/appEnum'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

const { getTheme, setDarkMode } = useRootSetting()

const lightIcon = h('span', { class: 'i-ic:baseline-wb-sunny text-yellow-300' })
const darkIcon = h('span', { class: 'i-ic:outline-dark-mode text-purple-300' })

function toggleDarkMode() {
  const darkMode = unref(getTheme) === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT
  setDarkMode(darkMode)

  updateDarkMode(darkMode)
  updateHeaderBgColor()
  updateSidebarBgColor()
}
</script>
