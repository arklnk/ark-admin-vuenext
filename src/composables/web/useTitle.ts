import { useRouter } from 'vue-router'
import { useTitle as usePageTitle } from '@vueuse/core'
import { unref, watch } from 'vue'

export function useTitle() {
  const title = import.meta.env.VITE_APP_TITLE

  const { currentRoute } = useRouter()
  const pageTitle = usePageTitle()

  watch(
    () => currentRoute.value.path,
    () => {
      const route = unref(currentRoute)

      const name = route?.meta?.title
      pageTitle.value = name ? `${name} - ${title}` : title
    },
    {
      immediate: true,
    }
  )
}
