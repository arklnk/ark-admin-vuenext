import type { MenuSetting } from '/#/config'

import { computed, unref } from 'vue'
import { useAppStore } from '/@/stores/modules/app'

export function useMenuSetting() {
  const appStore = useAppStore()

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed)

  const getUniqueOpened = computed(() => appStore.getMenuSetting.uniqueOpened)

  const getBgColor = computed(() => appStore.getMenuSetting.bgColor)

  const getMenuMode = computed(() => appStore.getMenuSetting.menuMode)

  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign)

  const getMenuTheme = computed(() => appStore.getMenuSetting.theme)

  function setMenuSetting(menuSetting: Partial<MenuSetting>) {
    appStore.setProjectConfig({ menuSetting })
  }

  function toggleCollapse() {
    setMenuSetting({
      collapsed: !unref(getCollapsed),
    })
  }

  return {
    setMenuSetting,
    toggleCollapse,

    getTopMenuAlign,
    getMenuMode,
    getBgColor,
    getCollapsed,
    getUniqueOpened,
    getMenuTheme,
  }
}
