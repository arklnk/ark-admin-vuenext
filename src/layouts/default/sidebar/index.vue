<template>
  <ElDrawer
    v-if="getIsMobile"
    :model-value="!getCollapsed"
    :with-header="false"
    :size="getMenuWidth"
    direction="ltr"
    @close="handleClose"
    :custom-class="prefixCls"
  >
    <SiderBar />
  </ElDrawer>
  <SiderBar v-else />
</template>

<script setup lang="ts">
import SiderBar from './LayoutSidebar.vue'
import { useAppInject } from '/@/composables/core/useAppInject'
import { useMenuSetting } from '/@/composables/setting/useMenuSetting'
import { useDesign } from '/@/composables/core/useDesign'

const { getIsMobile } = useAppInject()

const { getCollapsed, getMenuWidth, setMenuSetting } = useMenuSetting()

const { prefixCls } = useDesign('layout-sidebar-wrapper')

function handleClose() {
  setMenuSetting({
    collapsed: true,
  })
}
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-layout-sidebar-wrapper;

.#{$prefixCls} {
  .el-drawer__body {
    height: 100vh;
    padding: 0;
  }
}
</style>
