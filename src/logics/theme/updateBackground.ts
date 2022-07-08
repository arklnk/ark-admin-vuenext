import { DARK_MODE_MIX_COLOR, ThemeEnum } from '/@/enums/appEnum'
import { HEADER_PRESET_BG_COLOR_LIST, SIDE_BAR_BG_COLOR_LIST } from '/@/settings/designSetting'
import { useAppStore } from '/@/stores/modules/app'
import { colorIsLight, mixDarken, mixLighten } from '/@/utils/color'
import { setCssVar } from '/@/utils/dom'

const SIDEBAR_BG_COLOR = '--sidebar-bg-color'
const SIDEBAR_DARKEN_BG_COLOR = '--sidebar-darken-bg-color'

export function updateSidebarBgColor(color?: string) {
  const appStore = useAppStore()
  const darkMode = appStore.getDarkMode === ThemeEnum.DARK

  if (!color) {
    if (darkMode) {
      const darkColorIndex = SIDE_BAR_BG_COLOR_LIST.findIndex((color) => !colorIsLight(color))
      // 当前背景色一定是暗色
      color = darkColorIndex === -1 ? DARK_MODE_MIX_COLOR : SIDE_BAR_BG_COLOR_LIST[darkColorIndex]
    } else {
      color = appStore.getMenuSetting.bgColor
    }
  }

  const isLightColor = colorIsLight(color)

  // 更新背景色
  setCssVar(SIDEBAR_BG_COLOR, color)
  if (!isLightColor) {
    const darkenBgColor = mixDarken(color, 0.2)
    // 次级菜单颜色
    setCssVar(SIDEBAR_DARKEN_BG_COLOR, darkenBgColor)
  }

  appStore.setProjectConfig({
    menuSetting: {
      theme: isLightColor ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  })
}

const HEADER_BG_COLOR = '--header-bg-color'
const HEADER_HOVER_BG_COLOR = '--header-hover-bg-color'

export function updateHeaderBgColor(color?: string) {
  const appStore = useAppStore()
  const darkMode = appStore.getDarkMode === ThemeEnum.DARK

  if (!color) {
    if (darkMode) {
      const darkColorIndex = HEADER_PRESET_BG_COLOR_LIST.findIndex((color) => !colorIsLight(color))
      color =
        darkColorIndex === -1 ? DARK_MODE_MIX_COLOR : HEADER_PRESET_BG_COLOR_LIST[darkColorIndex]
    } else {
      color = appStore.getHeaderSetting.bgColor
    }
  }

  const isLightColor = colorIsLight(color)

  setCssVar(HEADER_BG_COLOR, color)

  if (!isLightColor) {
    const lightenBgColor = mixLighten(color, 0.05)
    setCssVar(HEADER_HOVER_BG_COLOR, lightenBgColor)
  } else {
    const darkenBgColor = mixDarken(color, 0.05)
    setCssVar(HEADER_HOVER_BG_COLOR, darkenBgColor)
  }

  appStore.setProjectConfig({
    headerSetting: {
      theme: isLightColor ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  })
}
