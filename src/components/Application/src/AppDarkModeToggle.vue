<template>
  <span class="w-full text-2xl text-center cursor-pointer text-black dark:text-white" @click="toggleDarkMode">
    <IcBaselineWbSunny v-if="getTheme === ThemeEnum.LIGHT" />
    <IcOutlineDarkMode v-else />
  </span>
</template>

<script setup lang="ts">
import { unref } from 'vue'
import IcBaselineWbSunny from '~icons/ic/baseline-wb-sunny'
import IcOutlineDarkMode from '~icons/ic/outline-dark-mode'
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/core/theme/updateBackground'
import { updateDarkMode } from '/@/core/theme/updateDarkMode'
import { ThemeEnum } from '/@/enums/appEnum'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const { getTheme, setDarkMode } = useRootSetting()

function toggleDarkMode() {
  const darkMode = unref(getTheme) === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT
  setDarkMode(darkMode)

  updateDarkMode(darkMode)
  updateHeaderBgColor()
  updateSidebarBgColor()
}
</script>
