<template>
  <ElDialog v-bind="getBindValue">
    <!-- header -->
    <template #header="{ titleId, titleClass }">
      <div :id="titleId" :class="titleClass">
        <DialogHeader v-if="!$slots.title" v-bind="getHeaderBindValue" />
        <slot v-else name="title"></slot>
      </div>
      <div :class="`${prefixCls}-close`">
        <DialogClose
          v-if="!$slots.closeIcon"
          v-bind="getCloseIconBindValue"
          @cancel="handleCancel"
          @fullscreen="handleFullscreen"
        />
        <slot v-else name="closeIcon"></slot>
      </div>
    </template>

    <!-- footer -->
    <template #footer>
      <DialogFooter
        v-if="!$slots.footer"
        v-bind="getMergeProps"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
      <slot v-else name="footer"></slot>
    </template>

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
import DialogFooter from './components/DialogFooter.vue'
import DialogClose from './components/DialogClose.vue'
import { isFunction } from 'lodash-es'

export default defineComponent({
  name: 'BasicDialog',
  components: {
    DialogHeader,
    DialogClose,
    DialogFooter,
  },
  inheritAttrs: false,
  props: basicProps,
  emits: ['register', 'confirm', 'cancel', 'update:visible', 'visible-change'],
  setup(props, { emit }) {
    const visibleRef = ref(false)
    const fullscreenRef = ref(false)

    const innerPropsRef = ref<Partial<BasicDialogProps>>()
    const { prefixCls } = useDesign('basic-dialog')

    const getMergeProps = computed((): BasicDialogProps => {
      return {
        ...props,
        ...unref(innerPropsRef),
      } as BasicDialogProps
    })

    const getBindValue = computed((): Recordable => {
      const props = unref(getMergeProps)

      const opt: Recordable = {
        center: false,
        draggable: props.draggable,
        width: props.width,
        showClose: false,
        customClass: prefixCls,
        modelValue: unref(visibleRef),
        fullscreen: unref(fullscreenRef),
        beforeClose: handleCancel,
      }

      if (props.modal === false) {
        opt.appendToBody = true
      }

      return opt
    })

    const getCloseIconBindValue = computed((): Recordable => {
      const props = unref(getMergeProps)

      return {
        canFullscreen: props.canFullscreen,
        fullscreen: fullscreenRef.value,
      }
    })

    const getHeaderBindValue = computed((): Recordable => {
      const props = unref(getMergeProps)

      return {
        helpMessage: props.helpMessage,
        title: props.title,
      }
    })

    async function handleCancel(e: Event) {
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc()
        visibleRef.value = !isClose
        return
      }

      visibleRef.value = false
      emit('cancel', e)
    }

    function handleConfirm(e: Event) {
      emit('confirm', e)
    }

    function handleFullscreen(_e: Event) {
      fullscreenRef.value = !unref(fullscreenRef)
    }

    watchEffect(() => {
      visibleRef.value = !!props.visible
      fullscreenRef.value = !!props.defaultFullScreen
    })

    watch(
      () => unref(visibleRef),
      (v) => {
        emit('update:visible', v)
        emit('visible-change', v)
      }
    )

    return {
      prefixCls,
      getBindValue,
      getMergeProps,
      getCloseIconBindValue,
      getHeaderBindValue,
      handleCancel,
      handleConfirm,
      handleFullscreen,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-dialog;

.#{$prefixCls} {
  display: flex;
  flex-direction: column;

  .el-dialog__header {
    margin-right: 0;
    position: relative;
    padding: 16px 24px;

    .#{$prefixCls}-close {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      padding-right: 24px;

      > span,
      > i {
        margin-left: 20px;
        font-size: 18px;
        cursor: pointer;
        color: var(--el-color-info);

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .el-dialog__body {
    position: relative;
    padding: 20px;
    flex: 1;
  }

  .el-dialog__footer {
    padding: 14px;
  }
}
</style>
