/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Color_White, isLight, mixDarken } from '/@/utils/color'
import { setCssVar } from '/@/utils/dom'

// const SIDEBAR_MENU_ACTIVE_COLOR = '--sidebar-menu-active-color'
const SIDEBAR_MENU_TEXT_COLOR = '--sidebar-menu-text-color'
const SIDEBAR_MENU_HOVER_TEXT_COLOR = 'sidebar-menu-hover-text-color'
const SIDEBAR_MENU_BG_COLOR = '--sidebar-menu-bg-color'
const SIDEBAR_MENU_HOVER_BG_COLOR = '--sidebar-menu-hover-bg-color'
const SIDEBAR_MENU_ITEM_HOVER_FILL = '--sidebar-menu-item-hover-fill'

export function updateSidebarBgColor(color: string) {
  const isLightColor = isLight(color)
  setCssVar(SIDEBAR_MENU_BG_COLOR, color)

  const hoverColor = mixDarken(color, 0.2)

  setCssVar(SIDEBAR_MENU_TEXT_COLOR, Color_White)

  setCssVar(SIDEBAR_MENU_HOVER_BG_COLOR, hoverColor)
  setCssVar(SIDEBAR_MENU_ITEM_HOVER_FILL, hoverColor)
}
