import type { Plugin } from 'vite'
import Icons from 'unplugin-icons/vite'

export function configIconsPlugin() {
  const iconsPlugin: Plugin = Icons({ compiler: 'vue3' })
  return iconsPlugin
}
