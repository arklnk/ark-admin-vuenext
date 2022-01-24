import { onBeforeMount, onMounted, onUnmounted } from 'vue'
import { DeviceEnum, MOBILE_WIDTH } from '/@/enums/appEnum'
import { useAppStore } from '/@/stores/modules/app'

export function useResize() {
  const appStore = useAppStore()

  function isMobile() {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < MOBILE_WIDTH
  }

  function resize() {
    if (!document.hidden) {
      const _isMobile = isMobile()
      appStore.device = _isMobile ? DeviceEnum.MOBILE : DeviceEnum.DESKTOP
    }
  }

  onMounted(() => {
    if (isMobile()) {
      appStore.device = DeviceEnum.MOBILE
    }
  })

  onBeforeMount(() => {
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return {
    isMobile,
  }
}
