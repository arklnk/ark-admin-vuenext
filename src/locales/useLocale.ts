import type { LangModule } from './typing'

import { computed, unref } from 'vue'
import { i18n } from './setupI18n'
import { useLocaleStore } from '/@/stores/modules/locale'

export function useLocale() {
  const localeStore = useLocaleStore()

  const getLocale = computed(() => localeStore.getLocale)

  const getShowPicker = computed(() => localeStore.getShowPicker)

  const getEleLocale = computed((): any => {
    const lang: LangModule['message'] | null = i18n.global.getLocaleMessage(unref(getLocale))
    return lang?.eleLocale ?? {}
  })

  const getDayjsLocale = computed((): any => {
    const lang: LangModule['message'] | null = i18n.global.getLocaleMessage(unref(getLocale))

    return lang?.dayjsLocale ?? {}
  })

  return {
    getLocale,
    getShowPicker,
    getEleLocale,
    getDayjsLocale,
  }
}
