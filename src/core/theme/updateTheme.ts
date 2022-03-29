/**
 * https://juejin.cn/post/7024025899813044232
 * sass mix函数的js版本，mix(color1 = rgb(r1,g1,b1),color2 = rgb(r2,g2,b2),weight)
 *
 * 计算公式
 * r = (r1 * (1 - weight) + r2 * weight);
 * g = (g1 * (1 - weight) + g2 * weight);
 * b = (b1 * (1 - weight) + b2 * weight);
 * finalColor = rgb(r,g,b);
 * @param color1
 * @param color2
 * @param weight
 * @returns
 */
export function mix(color1: string, color2: string, weight: number): string {
  weight = Math.max(Math.min(Number(weight), 1), 0)
  const r1 = parseInt(color1.substring(1, 3), 16)
  const g1 = parseInt(color1.substring(3, 5), 16)
  const b1 = parseInt(color1.substring(5, 7), 16)
  const r2 = parseInt(color2.substring(1, 3), 16)
  const g2 = parseInt(color2.substring(3, 5), 16)
  const b2 = parseInt(color2.substring(5, 7), 16)
  let r: string | number = Math.round(r1 * (1 - weight) + r2 * weight)
  let g: string | number = Math.round(g1 * (1 - weight) + g2 * weight)
  let b: string | number = Math.round(b1 * (1 - weight) + b2 * weight)
  r = ('0' + (r || 0).toString(16)).slice(-2)
  g = ('0' + (g || 0).toString(16)).slice(-2)
  b = ('0' + (b || 0).toString(16)).slice(-2)
  return '#' + r + g + b
}

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
 */
export function updateTheme() {}
