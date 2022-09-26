import type { MenuSetting } from '/#/config'

import { computed, unref } from 'vue'
import { useAppStore } from '/@/stores/modules/app'
import { useFullContent } from '../web/useFullContent'
import { MenuModeEnum, MenuTriggerEnum } from '/@/enums/menuEnum'
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

  const getShowTopMenu = computed(() => unref(getMenuMode) === MenuModeEnum.TOP_MENU)

  const getRealWidth = computed(() =>
    unref(getCollapsed) ? SIDE_BAR_COLLAPSED_WIDTH : unref(getMenuWidth)
  )

  const getCalcHeaderWidth = computed(() => {
    const width = unref(getShowTopMenu) ? 0 : unref(getRealWidth)
    return `calc(100vw - ${width}px)`
  })

  const getMenuTrigger = computed(() => appStore.getMenuSetting.trigger || MenuTriggerEnum.TOP)

  const getShowHeaderTrigger = computed(() => {
    return (
      unref(getMenuMode) !== MenuModeEnum.TOP_MENU && unref(getMenuTrigger) === MenuTriggerEnum.TOP
    )
  })

  const getShowSidebarTrigger = computed(() => unref(getMenuTrigger) === MenuTriggerEnum.BOTTOM)

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
    getMenuWidth,
    getRealWidth,
    getCalcHeaderWidth,
    getShowSideBar,
    getShowTopMenu,
    getMenuTrigger,
    getShowSidebarTrigger,
    getShowHeaderTrigger,
  }
}
