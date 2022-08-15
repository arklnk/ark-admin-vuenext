import type { LocaleType } from '/#/config'

import { set } from 'lodash-es'

// loaded locale pool
export const loadLocalePool: LocaleType[] = []

export function setHtmlPageLang(lang: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', lang)
}

export function genMessage(modules: Recordable<Recordable>, lang: string) {
  const message: Recordable = {}

  Object.keys(modules).forEach((key) => {
    const langModule = modules[key].default

    // use file name to namespace
    let filename = key.replace(`./${lang}/`, '')
    const lastIndex = filename.lastIndexOf('.')
    // remove file suffix
    filename = filename.substring(0, lastIndex)
    const keyList = filename.split('/') // '/' is not exist will empty array
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')

    // module name is not undef
    if (moduleName) {
      if (objKey) {
        // set namespace
        set(message, moduleName, message[moduleName] || {})
        // set ns module
        set(message[moduleName], objKey, langModule)
      } else {
        set(message, moduleName, langModule)
      }
    }
  })

  return message
}
