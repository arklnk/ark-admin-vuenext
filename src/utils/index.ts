import type { App, Plugin } from 'vue'

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

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
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
