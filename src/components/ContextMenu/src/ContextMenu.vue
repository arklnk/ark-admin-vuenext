<script lang="tsx">
import type { PropType, CSSProperties } from 'vue'
import type { Axis, ContextMenuItem } from './typing'

import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  unref,
  toRefs,
  computed,
} from 'vue'

const props = {
  width: {
    type: Number,
    default: 156,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  customStyle: {
    type: Object as PropType<CSSProperties>,
    default: null,
  },
  axis: {
    type: Object as PropType<Axis>,
    default: (): Axis => {
      return { x: 0, y: 0 }
    },
  },
  items: {
    type: Array as PropType<ContextMenuItem[]>,
    default: () => [],
  },
}

const ContextMenuItemHeight = 40

export default defineComponent({
  name: 'ContextMenu',
  props,
  setup(props) {
    const wrapperRef = ref(null)
    const showRef = ref(false)

    const getStyle = computed((): CSSProperties => {
      const { axis, width, items, customStyle } = toRefs(props)
      const { x, y } = unref(axis) || { x: 0, y: 0 }
      const menuHeight = (unref(items) || []).length * ContextMenuItemHeight
      const menuWidth = unref(width)

      const left = document.body.clientWidth < x + menuWidth ? x - menuWidth : x
      const top = document.body.clientHeight < y + menuHeight ? y - menuHeight : y
      return {
        ...customStyle.value,
        position: 'absolute',
        width: `${menuWidth}px`,
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 9999,
      }
    })

    onMounted(() => {
      nextTick(() => {
        showRef.value = true
      })
    })

    onUnmounted(() => {
      const el = unref(wrapperRef)
      if (el) {
        document.body.removeChild(el)
      }
    })
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-context-menu;

.#{$prefixCls} {
  position: fixed;
}
</style>
