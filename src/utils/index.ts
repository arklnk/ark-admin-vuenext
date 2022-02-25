import { isEmpty } from 'lodash-es'

const defaultTitle = import.meta.env.VITE_APP_TITLE

/**
 * 获取格式化的document标题文本
 */
export function getPageTitle(subTitle: string | undefined | null) {
  if (isEmpty(subTitle)) {
    return defaultTitle
  }
  return `${subTitle} - ${defaultTitle}`
}

/**
 * / _ - 符号转换成驼峰
 */
export function toHump(name: string) {
  return name.replace(/[\-\/\_](\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

/**
 * print ansi
 */
export function printANSI() {
  console.log(`
  ####  ######         ##   #####  #    # # #    #
 #      #             #  #  #    # ##  ## # ##   #
  ####  #####  ##### #    # #    # # ## # # # #  #
      # #            ###### #    # #    # # #  # #
 #    # #            #    # #    # #    # # #   ##
  ####  #            #    # #####  #    # # #    #
`)
}
