<script lang="tsx">
import { defineComponent, ref, toRefs } from 'vue'
import { createAppProviderContext } from './useAppContext'
import { MOBILE_WIDTH } from '/@/enums/appEnum'
import { useWindowSizeFn } from '/@/composables/event/useWindowSizeFn'
import { prefixCls as PrefixClsValue } from '/@/settings/designSetting'

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

    function windowSizeListener() {
      const rect = document.body.getBoundingClientRect()
      isMobile.value = rect.width - 1 < MOBILE_WIDTH
    }

    useWindowSizeFn(windowSizeListener)

    // Inject variables into the global
    createAppProviderContext({
      isMobile,
      prefixCls,
    })

    return () => slots.default?.()
  },
})
</script>
