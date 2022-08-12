import type { App } from 'vue'
import type { I18nOptions, I18n } from 'vue-i18n'

import { createI18n } from 'vue-i18n'
import { localeSetting } from '../settings/localeSetting'
import { useLocaleStore } from '../stores/modules/locale'
import { setHtmlPageLang } from './helper'

const { fallback, availableLocales } = localeSetting

export let i18n: I18n

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStore()
  const locale = localeStore.getLocale
  const defaultLocale = await import(`./lang/${locale}.ts`)
  const message = defaultLocale.default?.message || {}

  // set page lang
  setHtmlPageLang(locale)

  return {
    legacy: false,
    locale,
    messages: {
      [locale]: message,
    },
    fallbackLocale: fallback,
    availableLocales,
    sync: false,
  }
}

export async function setupI18n(app: App) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
