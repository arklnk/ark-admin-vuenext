import type { Ref } from 'vue'
import type { ThemeEnum } from '/@/enums/appEnum'

import { computed } from 'vue'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

export function useECharts(_elRef: Ref<Nullable<HTMLDivElement>>, theme: ThemeEnum | 'default') {
  const { getTheme } = useRootSetting()

  const getDarkMode = computed(() => {
    return theme === 'default' ? getTheme.value : theme
  })

  return {
    getDarkMode,
  }
}
