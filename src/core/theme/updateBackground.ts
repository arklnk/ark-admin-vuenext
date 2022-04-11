import { Color_Black, Color_White, isLight, mixDarken } from '/@/utils/color'
import { setCssVar } from '/@/utils/dom'

const SIDEBAR_MENU_HOVER_TEXT_COLOR = '--sidebar-menu-hover-text-color'
const SIDEBAR_MENU_TEXT_COLOR = '--sidebar-menu-text-color'
const SIDEBAR_MENU_ACTIVE_TEXT_COLOR = '--sidebar-menu-active-text-color'

const SIDEBAR_MENU_BG_COLOR = '--sidebar-menu-bg-color'
const SIDEBAR_SUBMENU_BG_COLOR = '--sidebar-submenu-bg-color'
const SIDEBAR_MENU_ACTIVE_BG_COLOR = '--sidebar-menu-active-bg-color'

const EL_COLOR_PRIMARY_VALUE = 'var(--el-color-primary)'

export function updateSidebarBgColor(color: string) {
  const isLightColor = isLight(color)

  // 设置菜单颜色
  setCssVar(SIDEBAR_MENU_BG_COLOR, color)

  if (!isLightColor) {
    /**
     * 暗色调
     */
    const subMenuBgColor = mixDarken(color, 0.2)
    // 次级菜单颜色
    setCssVar(SIDEBAR_SUBMENU_BG_COLOR, subMenuBgColor)

    // 菜单字体颜色
    setCssVar(SIDEBAR_MENU_TEXT_COLOR, Color_White)
    setCssVar(SIDEBAR_MENU_ACTIVE_TEXT_COLOR, Color_White)
    setCssVar(SIDEBAR_MENU_HOVER_TEXT_COLOR, mixDarken(Color_White, 0.3))

    // active
    setCssVar(SIDEBAR_MENU_ACTIVE_BG_COLOR, EL_COLOR_PRIMARY_VALUE)
  } else {
    /**
     * 亮色调
     */
    // 次级菜单颜色
    setCssVar(SIDEBAR_SUBMENU_BG_COLOR, color)

    // 菜单字体颜色
    setCssVar(SIDEBAR_MENU_TEXT_COLOR, Color_Black)
    setCssVar(SIDEBAR_MENU_ACTIVE_TEXT_COLOR, EL_COLOR_PRIMARY_VALUE)
    setCssVar(SIDEBAR_MENU_HOVER_TEXT_COLOR, EL_COLOR_PRIMARY_VALUE)

    // active
    setCssVar(SIDEBAR_MENU_ACTIVE_BG_COLOR, 'var(--el-color-primary-light-9)')
  }
}

export function updateHeaderBgColor(color: string) {
  console.log(color)
}
