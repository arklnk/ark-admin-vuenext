import type { Plugin } from 'vite'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { prefixCls } from '../../src/settings/designSetting'

export function configIconsPlugin(isBuild: boolean) {
  // iconfy
  const iconsPlugin: Plugin = Icons({
    compiler: 'vue3',
    defaultClass: `${prefixCls}-svg-icon`,
  })

  /**
   * https://github.com/vbenjs/vite-plugin-svg-icons
   */
  const svgIconsPlugin: Plugin = createSvgIconsPlugin({
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

  return [iconsPlugin, svgIconsPlugin]
}
