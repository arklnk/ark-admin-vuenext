import { ThemeEnum } from '/@/enums/appEnum'
import { toggleClass } from '/@/utils/dom'

/**
 * 设置暗色主题模式
 */
export function updateDarkMode(theme: ThemeEnum) {
  toggleClass(theme === ThemeEnum.DARK, 'dark', document.documentElement)
}
