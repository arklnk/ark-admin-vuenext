import type { MenuSetting } from '/#/config'

import { computed, unref } from 'vue'
import { useAppStore } from '/@/stores/modules/app'
import { useFullContent } from '../web/useFullContent'
import { MenuModeEnum } from '/@/enums/menuEnum'
import { SIDE_BAR_COLLAPSED_WIDTH } from '/@/enums/appEnum'

export function useMenuSetting() {
  const { getFullContent } = useFullContent()
  const appStore = useAppStore()

  const getCollapsed = computed(() => appStore.getMenuSetting.collapsed)

  const getUniqueOpened = computed(() => appStore.getMenuSetting.uniqueOpened)

  const getBgColor = computed(() => appStore.getMenuSetting.bgColor)

  const getMenuMode = computed(() => appStore.getMenuSetting.menuMode)

  const getTopMenuAlign = computed(() => appStore.getMenuSetting.topMenuAlign)

  const getMenuTheme = computed(() => appStore.getMenuSetting.theme)

  const getMenuWidth = computed(() => appStore.getMenuSetting.menuWidth)

  const getShowSideBar = computed(
    () => unref(getMenuMode) !== MenuModeEnum.TOP_MENU && !unref(getFullContent)
  )

  const getIsSidebar = computed(() => unref(getMenuMode) === MenuModeEnum.SIDEBAR)

  const getIsTopMenu = computed(() => unref(getMenuMode) === MenuModeEnum.TOP_MENU)

  const getRealWidth = computed(() =>
    unref(getCollapsed) ? SIDE_BAR_COLLAPSED_WIDTH : unref(getMenuWidth)
  )

  const getCalcContentWidth = computed(() => {
    const width = unref(getIsTopMenu) ? 0 : unref(getRealWidth)
    return `calc(100% - ${width}px)`
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
    getIsSidebar,
    getIsTopMenu,
    getMenuWidth,
    getRealWidth,
    getCalcContentWidth,
  }
}
