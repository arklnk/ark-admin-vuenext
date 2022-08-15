<template>
  <div class="flex flex-wrap justify-around" :class="prefixCls">
    <ElTooltip placement="bottom" :content="t('layout.setting.menuTypeSidebar')">
      <div
        :class="[
          `${prefixCls}-item`,
          `${prefixCls}-item--sidebar`,
          isActive(MenuModeEnum.SIDEBAR) ? `${prefixCls}-item--active` : '',
        ]"
        @click="handleClick(MenuModeEnum.SIDEBAR)"
      ></div>
    </ElTooltip>
    <ElTooltip placement="bottom" :content="t('layout.setting.menuTypeTop')">
      <div
        :class="[
          `${prefixCls}-item`,
          `${prefixCls}-item--top-menu`,
          isActive(MenuModeEnum.TOP_MENU) ? `${prefixCls}-item--active` : '',
        ]"
        @click="handleClick(MenuModeEnum.TOP_MENU)"
      ></div>
    </ElTooltip>
  </div>
</template>

<script setup lang="ts">
import { MenuModeEnum } from '/@/enums/menuEnum'
import { useDesign } from '/@/composables/core/useDesign'
import { useTransl } from '/@/composables/core/useTransl'

const props = defineProps({
  def: {
    type: String as PropType<MenuModeEnum>,
    required: true,
  },
})

const emit = defineEmits<{ (e: 'change', value: MenuModeEnum): void }>()

const { t } = useTransl()
const { prefixCls } = useDesign('setting-menu-mode-picker')

function isActive(cur: MenuModeEnum) {
  return props.def === cur
}

function handleClick(cur: MenuModeEnum) {
  emit('change', cur)
}
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-setting-menu-mode-picker;
$sidebar-width: 20px;
$header-height: 14px;

html.dark {
  .#{$prefixCls} {
    &-item {
      background-color: var.$color-black;
    }
  }
}

.#{$prefixCls} {
  &-item {
    position: relative;
    height: 48px;
    width: 56px;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: var.$app-bg-color;
    box-shadow: 0 1px 2.5px #0000002e;
    // border: 2px solid transparent;

    &:hover {
      border: 2px solid var(--el-color-primary);
    }

    &--active {
      border: 2px solid var(--el-color-primary);
    }

    &--sidebar {
      &::before {
        content: ' ';
        position: absolute;
        width: $sidebar-width;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        background-color: var(--sidebar-bg-color);
      }

      &::after {
        content: ' ';
        position: absolute;
        height: $header-height;
        width: calc(56px - #{$sidebar-width});
        top: 0;
        right: 0;
        background-color: var(--header-bg-color);
      }
    }

    &--top-menu {
      &::before {
        content: ' ';
        position: absolute;
        height: $header-height;
        width: 100%;
        top: 0;
        left: 0;
        background-color: var(--header-bg-color);
      }
    }
  }
}
</style>
