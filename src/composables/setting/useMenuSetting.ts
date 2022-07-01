import type { MenuSetting } from '/#/config'

import { computed, unref } from 'vue'
import { useAppStore } from '/@/stores/modules/app'
import { useFullContent } from '../web/useFullContent'
import { MenuModeEnum } from '/@/enums/menuEnum'

export function useMenuSetting() {
  const { getFullContent } = useFullContent()
  const appStore = useAppStore()

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed)

  const getUniqueOpened = computed(() => appStore.getMenuSetting.uniqueOpened)

  const getBgColor = computed(() => appStore.getMenuSetting.bgColor)

  const getMenuMode = computed(() => appStore.getMenuSetting.menuMode)

  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign)

  const getMenuTheme = computed(() => appStore.getMenuSetting.theme)

  const getShowSideBar = computed(() => {
    return unref(getMenuMode) !== MenuModeEnum.TOP_MENU && !unref(getFullContent)
  })

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

    getShowSideBar,
    getTopMenuAlign,
    getMenuMode,
    getBgColor,
    getCollapsed,
    getUniqueOpened,
    getMenuTheme,
  }
}
