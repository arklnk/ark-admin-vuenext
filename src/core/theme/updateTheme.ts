import { useRootSetting } from '/@/hooks/setting/useRootSetting'
import { mixDarken, mixLighten } from '/@/utils/color'
import { setCssVar } from '/@/utils/dom'

const Element_CssVar_Prefix = '--el-color-primary'

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
 * https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/common/var.scss
 */
export function updateTheme(themeColor: string) {
  const { setRootSetting } = useRootSetting()

  setRootSetting({ themeColor })

  setCssVar(Element_CssVar_Prefix, themeColor)

  // set lighten css var
  for (let i = 1; i < 10; i++) {
    setCssVar(`${Element_CssVar_Prefix}-light-${i}`, mixLighten(themeColor, i * 0.1))
  }

  // set darken css var
  setCssVar(`${Element_CssVar_Prefix}-dark-2`, mixDarken(themeColor, 2 * 0.1))
}
