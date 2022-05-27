import type { Plugin } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_APP_TITLE } = env

  const htmlPlugin: Plugin[] = createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_APP_TITLE,
      },
    },
  }) as Plugin[]
  return htmlPlugin
}
