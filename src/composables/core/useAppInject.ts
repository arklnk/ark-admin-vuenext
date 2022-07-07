import { computed, unref } from 'vue'
import { useAppProviderContext } from '/@/components/Application/src/useAppContext'

export function useAppInject() {
  const ctx = useAppProviderContext()

  const getIsMobile = computed(() => unref(ctx.isMobile))

  return {
    getIsMobile,
  }
}
