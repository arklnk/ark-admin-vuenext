import type { App } from 'vue'
import type { I18nOptions, I18n } from 'vue-i18n'

import { createI18n } from 'vue-i18n'
import { localeSetting } from '../settings/localeSetting'
import { useLocaleStore } from '../stores/modules/locale'
import { loadLocalePool, setHtmlPageLang } from './helper'

// global i18n instance, replace to useI18n
export let i18n: I18n

async function createI18nOptions(): Promise<I18nOptions> {
  const { fallback, availableLocales } = localeSetting
  const localeStore = useLocaleStore()

  const locale = localeStore.getLocale

  // init default lang
  const defaultLocale = await import(`./lang/${locale}.ts`)
  const message = defaultLocale.default?.message || {}
  setHtmlPageLang(locale)
  loadLocalePool.push(locale)

  return {
    legacy: false, // must be false
    locale,
    messages: {
      [locale]: message,
    },
    fallbackLocale: fallback,
    availableLocales,
    sync: false,
    silentTranslationWarn: true,
    missingWarn: true,
    silentFallbackWarn: true,
  }
}

export async function setupI18n(app: App) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
