import type { Plugin } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import windicss from 'vite-plugin-windicss'

import Icons from 'unplugin-icons/vite'

export function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[])[] = [vue(), vueJsx()]

  // windicss
  vitePlugins.push(windicss())

  // icons
  vitePlugins.push(Icons({ compiler: 'vue3' }))

  if (isBuild) {
    // TODO
  }
  return vitePlugins
}
