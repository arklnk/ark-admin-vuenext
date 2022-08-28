<script lang="tsx">
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { Axis, ContextMenuItem, ItemContentProps } from './typing'

import { defineComponent, ref, onMounted, nextTick, unref, toRefs, computed } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'

const props = {
  width: {
    type: Number,
    default: 156,
  },
  offset: {
    type: Number,
    default: 10,
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
  const Icon = props.item.icon as string | any
  return (
    <>
      {props.showIcon && Icon ? (
        <>{typeof Icon === 'string' ? <span class={props.item.icon} /> : <Icon />}</>
      ) : null}
      <span class="ml-2">{props.item.label}</span>
    </>
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
      const { axis, width, items, customStyle, offset } = toRefs(props)
      const { x, y } = unref(axis) || { x: 0, y: 0 }
      const menuHeight = (unref(items) || []).length * ContextMenuItemHeight
      const menuWidth = unref(width)
      const offsetV = unref(offset)

      const left =
        document.body.clientWidth < x + menuWidth + offsetV ? x - menuWidth - offsetV : x + offsetV
      const top =
        document.body.clientHeight < y + menuHeight + offsetV
          ? y - menuHeight - offsetV
          : y + offsetV
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
        const { disabled, label, divider = false } = item

        const contentProps: ItemContentProps = {
          showIcon: props.showIcon,
          item,
        }

        return (
          <>
            <el-menu-item
              disabled={disabled}
              index={label!}
              onClick={handleItemClick.bind(null, item, null)}
            >
              <ItemContent {...contentProps} />
            </el-menu-item>
            {divider ? <el-divider key={`d-${label}`} /> : null}
          </>
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
            collapse={false}
            collapse-transition={false}
            unique-opened={true}
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
  z-index: 200;
  left: 0;
  top: 0;
  width: 0;
  height: 0;

  .el-menu {
    --el-menu-item-height: #{$item-height};
    --el-menu-sub-item-height: #{$item-height};

    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    background-clip: padding-box;

    user-select: none;
    border: none;
    background-color: var(--el-bg-color-overlay);

    .el-divider--horizontal {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
