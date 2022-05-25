import { toggleClass } from '/@/utils/dom'

/**
 * 设置暗色主题模式
 */
export function updateDarkMode(dark: boolean) {
  toggleClass(dark, 'dark', document.documentElement)
}
