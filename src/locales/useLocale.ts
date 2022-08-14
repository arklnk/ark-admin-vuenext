import type { LangModule } from './typing'
import type { LocaleType } from '/#/config'

import { computed, unref } from 'vue'
import { useLocaleStore } from '/@/stores/modules/locale'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale: globalLocale, getLocaleMessage, setLocaleMessage } = useI18n()
  const localeStore = useLocaleStore()

  const getLocale = computed(() => localeStore.getLocale)

  const getShowPicker = computed(() => localeStore.getShowPicker)

  const getEleLocale = computed((): any => {
    return getLocaleMessage<LangModule['message']>(unref(getLocale))?.eleLocale ?? {}
  })

  const getDayjsLocale = computed((): any => {
    return getLocaleMessage<LangModule['message']>(unref(getLocale))?.dayjsLocale ?? {}
  })

  function setI18nLang(locale: LocaleType) {
    // check mode is legacy or composition
    globalLocale.value = locale

    // update store
    localeStore.setLocaleInfo({ locale })

    // update html lang
    setHtmlPageLang(locale)
  }

  // switch the lang will change the locale of useI18n
  async function changeLocale(locale: LocaleType) {
    const currentLocale = unref(globalLocale)

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
    setLocaleMessage(locale, message)
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
