import { computed } from 'vue'
import { TransitionSetting } from '/#/config'
import { useAppStore } from '/@/stores/modules/app'

export function useTransitionSetting() {
  const appStore = useAppStore()

  const getEnableNProgress = computed(() => appStore.getTransitionSetting.enableNProgress)

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting })
  }

  return {
    setTransitionSetting,

    getEnableNProgress,
  }
}
