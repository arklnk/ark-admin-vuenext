<template>
  <div v-if="getShowPlaceholderDom" :style="getPlaceholderDomStyle"><!-- placeholder --></div>
  <header ref="appHeaderRef" :style="getWrapStyle" :class="getWrapClass">
    <!-- left -->
    <div :class="`${prefixCls}-left`" class="flex h-full text-lg">
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        class="item !px-2"
        :theme="getHeaderTheme"
        :show-title="!getIsMobile"
      />
      <MenuTrigger
        class="item !px-3"
        v-if="getShowHeaderTrigger || getIsMobile"
        :collapsed="getCollapsed"
        @click="toggleCollapse"
      />
    </div>

    <!-- top menu -->
    <div v-if="getShowTopMenu && !getIsMobile" :class="`${prefixCls}-menu`">
      <Menu is-horizontal />
    </div>

    <!-- action -->
    <div class="flex flex-row h-full" :class="`${prefixCls}-action`">
      <Redo class="item" />
      <AppLocalePicker v-if="localeStore.getShowPicker" class="item" />
      <FullScreen v-if="getShowFullScreen" class="item" />
      <UserDropdown class="item" />
      <ProjectConfig v-if="getShowSettingButton" class="item" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { ref, onMounted, computed, unref } from 'vue'
import { AppLogo } from '/@/components/Application'
import { FullScreen, UserDropdown, Redo } from './components'
import ProjectConfig from '../setting/index.vue'
import Menu from '../menu/index.vue'
import MenuTrigger from '../menu/components/Trigger.vue'
import { useLayoutHeight } from '../content/useLayoutHeight'
import { useDesign } from '/@/composables/core/useDesign'
import { useHeaderSetting } from '/@/composables/setting/useHeaderSetting'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useRootSetting } from '/@/composables/setting/useRootSetting'
import { useAppInject } from '/@/composables/core/useAppInject'
import { AppLocalePicker } from '/@/components/Application'
import { useLocaleStore } from '/@/stores/modules/locale'

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

const { getIsMobile } = useAppInject()

const getWrapStyle = computed((): CSSProperties => {
  return {
    width: unref(getIsMobile) ? '100%' : unref(getCalcHeaderWidth),
  }
})

const getWrapClass = computed(() => {
  return [
    prefixCls,
    unref(getHeaderTheme),
    {
      'is-fixed': unref(getFixed),
    },
  ]
})

const { getShowSettingButton } = useRootSetting()

// placeholder
const getShowPlaceholderDom = computed(() => unref(getFixed) && unref(getShowHeader))
const getPlaceholderDomStyle = computed(() => {
  return {
    height: `${unref(appHeaderHeightRef)}px`,
  }
})

const localeStore = useLocaleStore()
</script>

<style lang="scss">
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-header;

.#{$prefixCls} {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
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

    .item {
      color: var.$color-black;
    }
  }

  @include when(dark) {
    color: var.$color-white;

    .item {
      color: var.$color-white;
    }
  }

  &-menu {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0 14px;
  }

  .item {
    height: 100%;
    display: flex;
    padding: 0 10px;
    cursor: pointer;
    align-items: center;
    position: relative;
    font-size: 18px;

    &:hover {
      border-color: var(--header-hover-bg-color);
      background-color: var(--header-hover-bg-color);
    }
  }
}
</style>
