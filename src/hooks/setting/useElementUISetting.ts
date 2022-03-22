import type { ElementUISetting } from '/#/config'

import { computed } from 'vue'
import { useAppStore } from '/@/stores/modules/app'

export function useElementUISetting() {
  const appStore = useAppStore()

  const getSize = computed(() => appStore.getElementUISetting.size)

  const getAutoInsertSpace = computed(() => appStore.getElementUISetting.autoInsertSpace)

  const getMaxMessage = computed(() => appStore.getElementUISetting.maxMessage)

  const getZIndex = computed(() => appStore.getElementUISetting.zIndex)

  function setElementUISetting(elementUISetting: Partial<ElementUISetting>) {
    appStore.setProjectConfig({ elementUISetting })
  }

  return {
    setElementUISetting,

    getSize,
    getAutoInsertSpace,
    getMaxMessage,
    getZIndex,
  }
}
