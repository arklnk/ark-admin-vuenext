import { isLight, mixDarken } from '/@/utils/color'
import { setCssVar } from '/@/utils/dom'

const SIDEBAR_BG_COLOR = '--sidebar-bg-color'
const SIDEBAR_DARKEN_BG_COLOR = '--sidebar-darken-bg-color'

export function updateSidebarBgColor(color: string) {
  const isLightColor = isLight(color)

  setCssVar(SIDEBAR_BG_COLOR, color)

  if (!isLightColor) {
    const darkenBgColor = mixDarken(color, 0.2)
    // 次级菜单颜色
    setCssVar(SIDEBAR_DARKEN_BG_COLOR, darkenBgColor)
  }
}

const HEADER_BG_COLOR = '--header-bg-color'
// const HEADER_LIGHTEN_BG_COLOR = '--header-lighten-bg-color'

export function updateHeaderBgColor(color: string) {
  setCssVar(HEADER_BG_COLOR, color)
}
