<template>
  <span class="text-center cursor-pointer text-yellow-300 dark:text-purple-300" @click="toggleDarkMode">
    <IcBaselineWbSunny v-if="getTheme === ThemeEnum.LIGHT" />
    <IcOutlineDarkMode v-else />
  </span>
</template>

<script setup lang="ts">
import { unref } from 'vue'
import IcBaselineWbSunny from '~icons/ic/baseline-wb-sunny'
import IcOutlineDarkMode from '~icons/ic/outline-dark-mode'
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground'
import { updateDarkMode } from '/@/logics/theme/updateDarkMode'
import { ThemeEnum } from '/@/enums/appEnum'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

const { getTheme, setDarkMode } = useRootSetting()

function toggleDarkMode() {
  const darkMode = unref(getTheme) === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT
  setDarkMode(darkMode)

  updateDarkMode(darkMode)
  updateHeaderBgColor()
  updateSidebarBgColor()
}
</script>
