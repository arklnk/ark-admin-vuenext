// https://github.com/vbenjs/vite-plugin-theme/blob/main/client/colorUtils.ts

export const Color_White = '#fff'
export const Color_Black = '#000'

export function mixLighten(colorStr: string, weight: number): string {
  return mix(Color_White, colorStr, weight)
}

export function mixDarken(colorStr: string, weight: number): string {
  return mix(Color_Black, colorStr, weight)
}

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
export function mix(
  color1: string,
  color2: string,
  weight: number,
  alpha1?: number,
  alpha2?: number
) {
  color1 = dropPrefix(color1)
  color2 = dropPrefix(color2)
  if (weight === undefined) weight = 0.5
  if (alpha1 === undefined) alpha1 = 1
  if (alpha2 === undefined) alpha2 = 1

  const w = 2 * weight - 1
  const alphaDelta = alpha1 - alpha2
  const w1 = ((w * alphaDelta === -1 ? w : (w + alphaDelta) / (1 + w * alphaDelta)) + 1) / 2
  const w2 = 1 - w1

  const rgb1 = toRGB(color1)
  const rgb2 = toRGB(color2)
  const r = Math.round(w1 * rgb1[0] + w2 * rgb2[0])
  const g = Math.round(w1 * rgb1[1] + w2 * rgb2[1])
  const b = Math.round(w1 * rgb1[2] + w2 * rgb2[2])
  return '#' + pad2(r) + pad2(g) + pad2(b)
}

export function toRGB(colorStr: string) {
  colorStr = dropPrefix(colorStr)
  if (colorStr.length === 3) {
    colorStr = colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2]
  }
  const r = parseInt(colorStr.slice(0, 2), 16)
  const g = parseInt(colorStr.slice(2, 4), 16)
  const b = parseInt(colorStr.slice(4, 6), 16)
  return [r, g, b]
}

export function dropPrefix(colorStr: string) {
  return colorStr.replace('#', '')
}

export function pad2(num: number) {
  let t = num.toString(16)
  if (t.length === 1) t = '0' + t
  return t
}

/**
 * https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
 * @returns
 */
export function colorIsLight(colorStr: string): boolean {
  const [r, g, b] = toRGB(colorStr)

  const brightness = r * 0.299 + g * 0.578 + b * 0.114
  return brightness > 192
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export function rgbToHex(r: number, g: number, b: number) {
  // tslint:disable-next-line:no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}
