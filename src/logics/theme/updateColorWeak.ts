import { toggleClass } from '/@/utils/dom'

/**
 * Change project color weak status
 * @param gray
 */
export function updateColorWeak(weak: boolean) {
  toggleClass(weak, 'color-weak', document.documentElement)
}
