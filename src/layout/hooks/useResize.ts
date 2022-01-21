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
    const _isMobile = isMobile()
    appStore.device = _isMobile ? DeviceEnum.MOBILE : DeviceEnum.DESKTOP
    console.log(appStore.device)
  }

  onMounted(() => {
    if (isMobile()) {
      // close sidebar
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
