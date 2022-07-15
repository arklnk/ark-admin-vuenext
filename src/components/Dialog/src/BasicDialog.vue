<template>
  <ElDialog v-bind="getBindValue" @update:model-value="handleUpdateVisible">
    <!-- header -->
    <template #header>
      <DialogHeader />
    </template>

    <!-- footer -->
    <template #footer></template>

    <!-- content -->
    <slot></slot>
  </ElDialog>
</template>

<script lang="ts">
import type { BasicDialogProps } from './typing'

import { computed, defineComponent, ref, unref, watch, watchEffect } from 'vue'
import { basicProps } from './props'
import { useDesign } from '/@/composables/core/useDesign'
import DialogHeader from './components/DialogHeader.vue'

export default defineComponent({
  name: 'BasicDialog',
  components: {
    DialogHeader,
  },
  inheritAttrs: false,
  props: basicProps,
  emits: ['register', 'confirm', 'cancel', 'update:visible'],
  setup(props, { emit }) {
    const visibleRef = ref(false)
    const innerPropsRef = ref<Partial<BasicDialogProps>>()
    const { prefixCls } = useDesign('basic-dialog')

    const getMergeProps = computed((): BasicDialogProps => {
      return {
        ...props,
        ...unref(innerPropsRef),
      } as BasicDialogProps
    })

    const getBindValue = computed(() => {
      const props = unref(getMergeProps)

      const opt: Recordable = {
        width: props.width,
        showClose: false,
        customClass: prefixCls,
        modelValue: unref(visibleRef),
      }

      if (props.modal === false) {
        opt.appendToBody = true
      }

      return opt
    })

    function handleUpdateVisible(v: boolean) {
      visibleRef.value = v
    }

    watchEffect(() => {
      visibleRef.value = !!props.visible
    })

    watch(
      () => unref(visibleRef),
      (v) => {
        emit('update:visible', v)
      }
    )

    return {
      getBindValue,
      handleUpdateVisible,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-dialog;

.#{$prefixCls} {
  .el-dialog__header {
    margin-right: 0;
  }
}
</style>
