import type { LangModule } from './typing'
import type { LocaleType } from '/#/config'

import { computed, unref } from 'vue'
import { useLocaleStore } from '/@/stores/modules/locale'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { i18n } from './setupI18n'

export function useLocale() {
  const localeStore = useLocaleStore()

  const getLocale = computed(() => localeStore.getLocale)

  const getShowPicker = computed(() => localeStore.getShowPicker)

  const getEleLocale = computed((): any => {
    return i18n.global.getLocaleMessage<LangModule['message']>(unref(getLocale))?.eleLocale ?? {}
  })

  const getDayjsLocale = computed((): any => {
    return i18n.global.getLocaleMessage<LangModule['message']>(unref(getLocale))?.dayjsLocale ?? {}
  })

  function setI18nLang(locale: LocaleType) {
    // check mode is legacy or composition
    if (typeof i18n.global.locale === 'string') {
      i18n.global.locale = locale
    } else {
      i18n.global.locale.value = locale
    }

    // update store
    localeStore.setLocaleInfo({ locale })

    // update html lang
    setHtmlPageLang(locale)
  }

  // switch the lang will change the locale of useI18n
  async function changeLocale(locale: LocaleType) {
    const globalI18n = i18n.global

    const currentLocale = unref(globalI18n.locale)

    // nothing change
    if (currentLocale === locale) {
      return
    }

    // is loaded
    if (loadLocalePool.includes(locale)) {
      setI18nLang(locale)
      return
    }

    // load module and set locale
    const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule
    if (!langModule) return

    const { message } = langModule
    globalI18n.setLocaleMessage(locale, message)
    loadLocalePool.push(locale)

    setI18nLang(locale)
  }

  return {
    getLocale,
    getShowPicker,
    getEleLocale,
    getDayjsLocale,
    changeLocale,
  }
}
