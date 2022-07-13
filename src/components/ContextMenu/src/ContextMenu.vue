<script lang="tsx">
import type { PropType, CSSProperties, FunctionalComponent } from 'vue'
import type { Axis, ContextMenuItem, ItemContentProps } from './typing'

import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  unref,
  toRefs,
  computed,
  h,
} from 'vue'
import { useDesign } from '/@/composables/core/useDesign'

const props = {
  width: {
    type: Number,
    default: 156,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  customEvent: {
    type: Object as PropType<Event>,
    default: null,
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

const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
  return (
    <div onClick={props.handler.bind(null, props.item)}>
      {props.showIcon && props.item.icon ? (
        <el-icon>
          {typeof props.item.icon === 'string' ? (
            <svg-icon icon={props.item.icon} />
          ) : (
            h(props.item.icon)
          )}
        </el-icon>
      ) : null}
      <span class="ml-2">{props.item.label}</span>
    </div>
  )
}

export default defineComponent({
  name: 'ContextMenu',
  props,
  setup(props) {
    const wrapperRef = ref(null)
    const showRef = ref(false)

    const { prefixCls } = useDesign('context-menu')

    const getStyle = computed((): CSSProperties => {
      const { axis, width, items, customStyle } = toRefs(props)
      const { x, y } = unref(axis) || { x: 0, y: 0 }
      const menuHeight = (unref(items) || []).length * ContextMenuItemHeight
      const menuWidth = unref(width)

      const left = document.body.clientWidth < x + menuWidth ? x - menuWidth : x
      const top = document.body.clientHeight < y + menuHeight ? y - menuHeight : y
      return {
        ...customStyle.value,
        position: 'fixed',
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

    function handleItemClick(item: ContextMenuItem, e?: MouseEvent) {
      const { disabled, handler } = item
      if (disabled) return

      showRef.value = false
      e?.stopPropagation()
      e?.preventDefault()
      handler?.()
    }

    function renderMenuItem(items: ContextMenuItem[]) {
      const visibleItems = items.filter((item) => !item.hidden)

      return visibleItems.map((item) => {
        const { disabled, label, divider = false, children } = item

        const contentProps: ItemContentProps = {
          showIcon: props.showIcon,
          item,
          handler: handleItemClick,
        }

        if (!children || children.length === 0) {
          return (
            <>
              <el-menu-item disabled={disabled} index={label!}>
                <ItemContent {...contentProps} />
              </el-menu-item>
              {divider ? <el-divider key={`d-${label}`} /> : null}
            </>
          )
        }

        return (
          <el-sub-menu disabled={disabled} index={label!} popper-class={`${prefixCls}__popper`}>
            {{
              default: () => renderMenuItem(children),
              title: () => <ItemContent {...contentProps} />,
            }}
          </el-sub-menu>
        )
      })
    }

    return () => {
      if (!unref(showRef)) return null

      return (
        <div class={prefixCls}>
          <el-menu
            style={unref(getStyle)}
            ref={wrapperRef}
            mode="vertical"
            collapse={true}
            collapse-transition={false}
          >
            {renderMenuItem(props.items)}
          </el-menu>
        </div>
      )
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-context-menu;

$item-height: 40px;

.#{$prefixCls} {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;

  @mixin cover-el-menu {
    .el-menu {
      --el-menu-item-height: #{$item-height};
      border: none;
      background-color: var(--el-bg-color-overlay);

      .el-divider--horizontal {
        margin: 0;
        width: 100%;
      }
    }
  }

  @include cover-el-menu();

  // popper
  &__popper {
    @include cover-el-menu();
  }
}
</style>
