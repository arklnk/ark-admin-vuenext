<script lang="tsx">
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { Axis, ContextMenuItem, ItemContentProps } from './typing'

import { defineComponent, ref, onMounted, nextTick, unref, toRefs, computed } from 'vue'
import { useDesign } from '/@/composables/core/useDesign'
import { ArrowRight } from '@element-plus/icons-vue'

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
    <div onClick={props.handler.bind(null, props.item)} class="flex flex-row items-center">
      {props.showIcon && Icon ? (
        <el-icon>
          {typeof Icon === 'string' ? <svg-icon icon={props.item.icon} /> : <Icon />}
        </el-icon>
      ) : null}
      <span class="ml-2 flex-1">{props.item.label}</span>
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

    function renderMenuItem(items: ContextMenuItem[], level: number) {
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

        // sub-menu slot
        const slots = {
          default: () => renderMenuItem(children, level + 1),
          title: () => (
            <>
              <div class="flex flex-row items-center w-full">
                <div class="flex-1">
                  <ItemContent {...contentProps} />
                </div>
                {level === 0 ? (
                  <el-icon class="root-sub-menu__arrow">
                    <ArrowRight />
                  </el-icon>
                ) : null}
              </div>
            </>
          ),
        }
        return (
          <el-sub-menu
            v-slots={slots}
            disabled={disabled}
            index={label!}
            popper-class={`${prefixCls}__popper`}
          />
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
            unique-opened={true}
          >
            {renderMenuItem(props.items, 0)}
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
      --el-menu-sub-item-height: #{$item-height};

      user-select: none;
      border: none;
      background-color: var(--el-bg-color-overlay);

      .el-divider--horizontal {
        margin: 0;
        width: 100%;
      }
    }
  }

  .el-menu {
    .el-sub-menu {
      .root-sub-menu__arrow {
        transform: var(--el-menu-icon-transform-closed);
        transition: transform var(--el-transition-duration);
        font-size: 12px;
        margin-right: -var(--el-menu-base-level-padding);
      }

      &.is-opened {
        .root-sub-menu__arrow {
          transform: var(--el-menu-icon-transform-open);
        }
      }
    }
  }

  @include cover-el-menu();

  &__popper {
    @include cover-el-menu();

    .el-menu--popup {
      padding: 0;
    }
  }
}
</style>
