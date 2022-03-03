import type { Plugin } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import windicss from 'vite-plugin-windicss'

import { configHtmlPlugin } from './html'
import { configIconsPlugin } from './icons'

export function createVitePlugins(env: ViteEnv, isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[])[] = [vue(), vueJsx()]

  // windicss
  vitePlugins.push(windicss())

  // icons
  vitePlugins.push(configIconsPlugin(isBuild))

  // html
  vitePlugins.push(configHtmlPlugin(env, isBuild))

  if (isBuild) {
    // TODO
  }
  return vitePlugins
}
