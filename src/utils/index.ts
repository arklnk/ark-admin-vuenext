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
  return name.replace(/[\-\/\_](\w)/g, function (_all, letter) {
    return letter.toUpperCase()
  })
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component as any)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * 1px -> 1
 * @param unit px rem
 * @returns
 */
export function numberUnit(unit: string) {
  return Number(unit.replace(/[^\d]/g, ''))
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&'
  }
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function openWindow(
  url: string,
  opt?: { target?: WindowTargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
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
