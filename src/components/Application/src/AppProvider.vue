<script lang="tsx">
import { defineComponent, ref, toRefs } from 'vue'
import { createAppProviderContext } from './useAppContext'
import { prefixCls as PrefixClsValue } from '/@/settings/designSetting'
import { createBreakpointListen } from '/@/composables/event/useBreakpoint'

const props = {
  prefixCls: {
    type: String,
    default: PrefixClsValue,
  },
}

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const isMobile = ref(false)
    const { prefixCls } = toRefs(props)

    createBreakpointListen(({ screenMap, sizeEnum, widthRef }) => {
      const smWidth = screenMap.get(sizeEnum.SM)
      if (smWidth) {
        isMobile.value = widthRef.value - 1 < smWidth
      }
    })

    // Inject variables into the global
    createAppProviderContext({ isMobile, prefixCls })

    return () => slots.default?.()
  },
})
</script>
