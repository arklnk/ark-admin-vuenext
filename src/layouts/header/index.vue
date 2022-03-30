<template>
  <header
    ref="appHeaderRef"
    :class="[d.b(), d.is('fixed', getFixed), d.is('collapsed', getCollapsed)]"
    class="border-gray-100 border-b flex flex-row justify-between bg-white box-border text-gray-700 relative"
  >
    <nav
      class="inline-block h-full px-4 cursor-pointer hover:bg-gray-50 flex items-center text-lg"
      @click="toggleCollapse"
    >
      <Hamburger :collapsed="getCollapsed" />
    </nav>
    <nav class="flex h-full text-lg">
      <FullScreen class="h-full hover:bg-gray-50 px-2 cursor-pointer items-center flex" />
      <UserDropdown class="h-full hover:bg-gray-50 px-2 cursor-pointer items-center flex" />
      <ProjectConfig class="h-full hover:bg-gray-50 px-2 cursor-pointer items-center flex" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { ref } from 'vue'
import { FullScreen, Hamburger, UserDropdown } from './components'
import ProjectConfig from '../setting/index.vue'

import { useLayoutHeight } from '../content/useAppMainHeight'
import { useDesign } from '/@/hooks/core/useDesign'
import { numberUnit } from '/@/utils'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting'

const d = useDesign('app-header')
const { setAppHeaderHeight } = useLayoutHeight()

const appHeaderRef = ref<HTMLElement>()
onMounted(() => {
  const appHeaderStyle = getComputedStyle(appHeaderRef.value!)
  setAppHeaderHeight(numberUnit(appHeaderStyle.height))
})

const { getFixed } = useHeaderSetting()
const { getCollapsed, toggleCollapse } = useMenuSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/mixins.scss' as *;
@use '/@/styles/var.scss';

@include b(app-header) {
  height: var.$navBarHeight;
  line-height: var.$navBarHeight;
  transition: width var.$transitionDuration;

  @include when(fixed) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - var.$sideBarWidth);

    @include when(collapsed) {
      width: calc(100% - var.$sideBarCollapsedWidth);
    }
  }
}
</style>
