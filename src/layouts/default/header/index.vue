<template>
  <div v-if="getShowPlaceholderDom" :style="getPlaceholderDomStyle"><!-- placeholder --></div>
  <header
    ref="appHeaderRef"
    :style="getWrapStyle"
    :class="[prefixCls, getHeaderTheme, getFixed ? 'is-fixed' : '']"
    class="flex flex-row justify-between box-border relative overflow-hidden"
  >
    <nav
      class="item items-center text-lg !px-4"
      @click="toggleCollapse"
      v-if="getShowHeaderTrigger"
    >
      <Hamburger :collapsed="getCollapsed" />
    </nav>
    <nav class="item !px-8">
      <AppLogo :theme="getHeaderTheme" show-title v-if="getShowHeaderLogo" />
    </nav>
    <nav v-if="getShowTopMenu" class="flex-1">
      <Menu is-horizontal />
    </nav>
    <nav class="flex h-full text-lg">
      <FullScreen v-if="getShowFullScreen" class="item" />
      <UserDropdown class="item" />
      <ProjectConfig v-if="getShowSettingButton" class="item" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { ref, onMounted, computed, unref } from 'vue'
import { AppLogo } from '/@/components/Application'
import { FullScreen, Hamburger, UserDropdown } from './components'
import ProjectConfig from '../setting/index.vue'
import Menu from '../menu/index.vue'
import { useLayoutHeight } from '../content/useLayoutHeight'
import { useDesign } from '/@/composables/core/useDesign'
import { useHeaderSetting } from '/@/composables/setting/useHeaderSetting'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

const { prefixCls } = useDesign('app-header')
const { setAppHeaderHeight, appHeaderHeightRef } = useLayoutHeight()

const appHeaderRef = ref<HTMLElement>()
onMounted(() => {
  setAppHeaderHeight(appHeaderRef.value!.offsetHeight)
})

const { getFixed, getShowFullScreen, getHeaderTheme, getShowHeaderLogo, getShowHeader } =
  useHeaderSetting()
const { getCollapsed, toggleCollapse, getShowHeaderTrigger, getShowTopMenu, getCalcHeaderWidth } =
  useMenuSetting()
const { getShowSettingButton } = useRootSetting()

const getShowPlaceholderDom = computed(() => unref(getFixed) && unref(getShowHeader))
const getPlaceholderDomStyle = computed(() => {
  return {
    height: `${unref(appHeaderHeightRef)}px`,
  }
})

const getWrapStyle = computed((): CSSProperties => {
  return {
    width: unref(getCalcHeaderWidth),
  }
})
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-header;

.#{$prefixCls} {
  height: var.$header-height;
  line-height: var.$header-height;
  transition: width var.$transition-duration;
  background-color: var(--header-bg-color);
  box-shadow: 0 8px 24px -2px rgb(0 0 0 / 5%);
  z-index: 9;

  @include when(is-fixed) {
    position: fixed;
    top: 0;
    right: 0;
  }

  @include when(light) {
    color: var.$color-black;
  }

  @include when(dark) {
    color: var.$color-white;
  }

  .item {
    height: 100%;
    display: flex;
    padding: 0 10px;
    cursor: pointer;
    align-items: center;
    position: relative;

    &:hover {
      border-color: var(--header-hover-bg-color);
      background-color: var(--header-hover-bg-color);
    }
  }
}
</style>
