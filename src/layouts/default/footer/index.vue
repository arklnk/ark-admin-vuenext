<template>
  <footer v-if="getIsShowFooter" ref="footerRef" :class="prefixCls" class="w-full text-center text-sm">
    <div>Copyright © 2021 SF Admin</div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useLayoutHeight } from '../content/useLayoutHeight'
import { useDesign } from '/@/composables/core/useDesign'
import { useRootSetting } from '/@/composables/setting/useRootSetting'

const { prefixCls } = useDesign('app-footer')

const footerRef = ref<HTMLDivElement>()
const { setAppFooterHeight } = useLayoutHeight()
const { getShowFooter } = useRootSetting()

const getIsShowFooter = computed(() => {
  if (unref(getShowFooter)) {
    setAppFooterHeight(unref(footerRef)?.offsetHeight || 0)
  } else {
    setAppFooterHeight(0)
  }

  return unref(getShowFooter)
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-app-footer;

.#{$prefixCls} {
  color: #57606a;
  padding: 24px 50px;
  color: #57606a;
}
</style>
