<template>
  <footer v-if="getIsShowFooter" ref="footerRef" :class="prefixCls">
    <div>Copyright © 2022-present arklnk. All rights reserved.</div>
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
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #57606a;
  padding: 12px 50px;
}
</style>
