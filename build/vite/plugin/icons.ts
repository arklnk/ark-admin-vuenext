import type { PluginOption } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

export function configIconsPlugin(isBuild: boolean) {
  /**
   * https://github.com/vbenjs/vite-plugin-svg-icons
   */
  const svgIconsPlugin: PluginOption = createSvgIconsPlugin({
    /**
     * Specify the icon folder to be cached
     */
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    /**
     * svg compression configuration
     */
    svgoOptions: isBuild,

    /**
     * custom insert position
     * @default body-last
     */
    inject: 'body-last',

    /**
     * Specify symbolId format
     * # src/icons
     * - icon1.svg # icon-icon1
     * - icon2.svg # icon-icon2
     * - icon3.svg # icon-icon3
     * - dir/icon1.svg # icon-dir-icon1
     * - dir/dir2/icon1.svg # icon-dir-dir2-icon1
     */
    symbolId: 'icon-[dir]-[name]',
  })

  return [svgIconsPlugin]
}
