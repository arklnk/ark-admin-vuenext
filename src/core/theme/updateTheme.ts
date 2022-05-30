import { DARK_MODE_MIX_COLOR } from '/@/enums/appEnum'
import { mix, mixDarken, mixLighten } from '/@/utils/color'

const Element_CssVar_Prefix = '--el-color-primary'
const APP_THEME_STYLE_ID = '__APP_THEME_STYLE_VAR__'

/**
 * 需要覆写的css变量并改变生成的light-${num}值
 * --el-color-primary: #409eff;
 * --el-color-primary-light-1: #53a8ff;
 * --el-color-primary-light-2: #66b1ff;
 * --el-color-primary-light-3: #79bbff;
 * --el-color-primary-light-4: #8cc5ff;
 * --el-color-primary-light-5: #a0cfff;
 * --el-color-primary-light-6: #b3d8ff;
 * --el-color-primary-light-7: #c6e2ff;
 * --el-color-primary-light-8: #d9ecff;
 * --el-color-primary-light-9: #ecf5ff;
 * --el-color-primary-dark-2: #337ecc;
 *
 * light mode：
 * https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss
 *
 * dark mode：
 * https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/dark/var.scss
 */
export function updateTheme(themeColor: string) {
  // 异步操作，避免生成样式时阻塞渲染
  setTimeout(() => {
    // 动态创建style标签
    let styleEle = document.getElementById(APP_THEME_STYLE_ID) as Nullable<HTMLStyleElement>

    if (!styleEle) {
      // 如果当前标签不存在则创建并插入body中
      styleEle = document.createElement('style')
      styleEle.id = APP_THEME_STYLE_ID
      styleEle.type = 'text/css'

      document.body.appendChild(styleEle)
    }

    const themeCss: string[] = []

    // 正常模式
    themeCss.push(':root {')
    themeCss.push(`  --el-color-primary: ${themeColor};`)
    for (let i = 1; i < 10; i++) {
      themeCss.push(`  ${Element_CssVar_Prefix}-light-${i}: ${mixLighten(themeColor, i * 0.1)};`)
    }
    themeCss.push(`  ${Element_CssVar_Prefix}-dark-2: ${mixDarken(themeColor, 2 * 0.1)};`)
    themeCss.push('}')

    // 夜间模式
    themeCss.push('html.dark {')
    themeCss.push('  color-scheme:dark;')
    themeCss.push(`  --el-color-primary: ${themeColor};`)
    for (let i = 1; i < 10; i++) {
      themeCss.push(
        `  ${Element_CssVar_Prefix}-light-${i}: ${mix(DARK_MODE_MIX_COLOR, themeColor, i * 0.1)};`
      )
    }
    themeCss.push(`  ${Element_CssVar_Prefix}-dark-2: ${mixLighten(themeColor, 2 * 0.1)};`)
    themeCss.push('}')

    // 设置style内容
    styleEle.innerHTML = themeCss.join('\n')
  }, 0)
}
