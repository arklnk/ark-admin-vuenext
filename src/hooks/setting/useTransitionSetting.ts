import { computed } from 'vue'
import { TransitionSetting } from '/#/config'
import { useAppStore } from '/@/stores/modules/app'

export function useTransitionSetting() {
  const appStore = useAppStore()

  const getEnableNProgress = computed(() => appStore.getTransitionSetting.enableNProgress)

  const getRouterTransition = computed(() => appStore.getTransitionSetting.routerTransition)

  const getEnableTransition = computed(() => appStore.getTransitionSetting.enable)

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting })
  }

  return {
    setTransitionSetting,

    getEnableTransition,
    getRouterTransition,
    getEnableNProgress,
  }
}
