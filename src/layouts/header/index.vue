<template>
  <header
    ref="appHeaderRef"
    :class="[prefixCls, getFixed ? 'is-fixed' : '', getCollapsed ? 'is-collapsed' : '', getLightOrDarkClass, isTopMenuMode ? 'not-has-sidebar' : '']"
    class="flex flex-row justify-between box-border relative overflow-hidden">
    <nav class="item items-center text-lg !px-4" @click="toggleCollapse" v-if="!isTopMenuMode">
      <Hamburger :collapsed="getCollapsed" />
    </nav>
    <nav v-if="isTopMenuMode" class="flex-1 px-30">
      <Menu is-horizontal />
    </nav>
    <nav class="flex h-full text-lg">
      <FullScreen class="item" />
      <UserDropdown class="item" />
      <ProjectConfig class="item" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { ref } from 'vue'
import { FullScreen, Hamburger, UserDropdown } from './components'
import ProjectConfig from '../setting/index.vue'

import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { numberUnit } from '/@/utils'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'
import { MenuModeEnum } from '/@/enums/menuEnum'
import Menu from '../menu/index.vue'

const { prefixCls } = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef = ref<HTMLElement>()
onMounted(() => {
  const appHeaderStyle = getComputedStyle(appHeaderRef.value!)
  setAppHeaderHeight(numberUnit(appHeaderStyle.height))
})

const { getFixed, getBgColor } = useHeaderSetting()
const { getCollapsed, getMenuMode, toggleCollapse } = useMenuSetting()

const getLightOrDarkClass = computed(() => isLight(getBgColor.value) ? 'light' : 'dark')

const isTopMenuMode = computed(() => getMenuMode.value === MenuModeEnum.TOP_MENU)
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss'as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-header;

.#{$prefixCls} {
  height: var.$header-height;
  line-height: var.$header-height;
  transition: width var.$transition-duration;
  background-color: var(--header-bg-color);

  @include when(is-fixed) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - var.$sidebar-width);

    @include when(is-collapsed) {
      width: calc(100% - var.$sidebar-collapsed-width);
    }
  }

  @include when(not-has-sidebar) {
    width: 100%;
  }

  @include when(light) {
    color: var.$color-black;
    border-bottom: 1px solid var.$border-color-base;
  }

  @include when(dark) {
    color: var.$color-white;
  }

  .item {
    height: 100%;
    display: flex;
    padding: 0 8px;
    cursor: pointer;
    align-items: center;
    position: relative;

    &::before {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-color: var(--header-hover-bg-color);
      background-color: var(--header-hover-bg-color);
      opacity: 0;
      content: " ";
      pointer-events: none;
    }

    &:hover::before {
      opacity: 1;
    }
  }
}
</style>
