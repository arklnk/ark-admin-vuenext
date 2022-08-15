import { useRouter } from 'vue-router'
import { useTitle as usePageTitle } from '@vueuse/core'
import { unref, watch } from 'vue'
import { useTransl } from '../core/useTransl'

export function useTitle() {
  const { currentRoute } = useRouter()
  const pageTitle = usePageTitle()
  const { t } = useTransl()

  watch(
    () => currentRoute.value.path,
    () => {
      const route = unref(currentRoute)

      const name = t(route?.meta?.title || '')
      pageTitle.value = name ? `${name} - ${t('common.appName')}` : t('common.appName')
    },
    {
      immediate: true,
    }
  )
}
