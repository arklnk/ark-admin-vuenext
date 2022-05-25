<template>
  <header
    ref="appHeaderRef"
    :class="[
      prefixCls,
      getFixed ? 'is-fixed' : '',
      isCollapsed ? 'is-collapsed' : '',
      getLightOrDarkClass,
      isTopMenuMode ? 'not-has-sidebar' : '',
    ]"
    class="flex flex-row justify-between box-border relative overflow-hidden"
  >
    <nav class="item items-center text-lg !px-4" @click="toggleCollapse" v-if="!isTopMenuMode">
      <Hamburger :collapsed="getCollapsed" />
    </nav>
    <nav class="item !px-8" v-if="showHeaderLogo">
      <AppLogo :theme="getLightOrDarkClass" show-title />
    </nav>
    <nav v-if="isTopMenuMode" class="flex-1">
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
import { ref, computed, onMounted } from 'vue'
import { AppLogo } from '/@/components/Application'
import { FullScreen, Hamburger, UserDropdown } from './components'
import ProjectConfig from '../setting/index.vue'

import { useLayoutHeight } from '../content/useLayoutHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'
import { isLight } from '/@/utils/color'
import { MenuModeEnum } from '/@/enums/menuEnum'
import Menu from '../menu/index.vue'
import { useRootSetting } from '/@/hooks/setting/useRootSetting'

const { prefixCls } = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef = ref<HTMLElement>()
onMounted(() => {
  setAppHeaderHeight(appHeaderRef.value!.offsetHeight)
})

const { getFixed, getBgColor, getShowFullScreen } = useHeaderSetting()
const { getCollapsed, getMenuMode, toggleCollapse } = useMenuSetting()
const { getShowLogo, getShowSettingButton } = useRootSetting()

const getLightOrDarkClass = computed(() => (isLight(getBgColor.value) ? 'light' : 'dark'))

const isTopMenuMode = computed(() => getMenuMode.value === MenuModeEnum.TOP_MENU)
const isCollapsed = computed(() => (isTopMenuMode.value ? false : getCollapsed.value))
const showHeaderLogo = computed(() => getShowLogo.value && isTopMenuMode.value)
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
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
    transition: none;
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
