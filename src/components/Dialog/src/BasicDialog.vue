<template>
  <ElDialog v-bind="getBindValue" :before-close="handleCancel">
    <!-- header -->
    <template #header="{ titleId, titleClass }">
      <div :id="titleId" :class="titleClass">
        <DialogHeader
          v-if="!$slots.title"
          :title="getMergeProps.title"
          :help-message="getMergeProps.helpMessage"
        />
        <slot v-else name="title"></slot>
      </div>
      <div :class="`${prefixCls}-close`">
        <DialogClose
          v-if="!$slots.closeIcon"
          :fullscreen="fullscreenRef"
          :can-fullscreen="getMergeProps.canFullscreen"
          @cancel="handleCancel"
          @fullscreen="handleFullscreen"
        />
        <slot v-else name="closeIcon"></slot>
      </div>
    </template>

    <!-- footer -->
    <template #footer>
      <div :class="`${prefixCls}-footer`">
        <DialogFooter
          v-if="!$slots.footer"
          :confirm-text="getMergeProps.confirmText"
          :confirm-btn-props="getMergeProps.confirmBtnProps"
          :cancel-text="getMergeProps.cancelText"
          :cancel-btn-props="getMergeProps.cancelBtnProps"
          :show-confirm-btn="getMergeProps.showConfirmBtn"
          :show-cancel-btn="getMergeProps.showCancelBtn"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        >
          <template #prepend><slot name="prependFooter"></slot></template>
          <template #center><slot name="centerFooter"></slot></template>
          <template #append><slot name="appendFooter"></slot></template>
        </DialogFooter>
        <slot v-else name="footer"></slot>
      </div>
    </template>

    <!-- content -->
    <div
      :style="getWrapperStyle"
      :class="`${prefixCls}-wrapper`"
      v-loading="getMergeProps.loading"
      :element-loading-text="getMergeProps.loadingTip"
    >
      <slot></slot>
    </div>
  </ElDialog>
</template>

<script lang="ts">
import type { BasicDialogActionType, BasicDialogProps } from './typing'
import type { CSSProperties } from 'vue'

import { computed, defineComponent, ref, unref, watch, watchEffect, getCurrentInstance } from 'vue'
import { basicProps } from './props'
import { useDesign } from '/@/composables/core/useDesign'
import DialogHeader from './components/DialogHeader.vue'
import DialogFooter from './components/DialogFooter.vue'
import DialogClose from './components/DialogClose.vue'
import { isFunction, merge, omit } from 'lodash-es'
import { useAppInject } from '/@/composables/core/useAppInject'
import { createDialogContext } from './composables/useDialogContext'

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
  setup(props, { emit, attrs }) {
    const visibleRef = ref(false)
    const fullscreenRef = ref(false)

    const innerPropsRef = ref<Partial<BasicDialogProps>>()
    const { prefixCls } = useDesign('basic-dialog')
    const { getIsMobile } = useAppInject()

    createDialogContext({
      visibleRef,
    })

    const getMergeProps = computed((): BasicDialogProps => {
      return {
        ...props,
        ...unref(innerPropsRef),
      } as BasicDialogProps
    })

    const getWrapperStyle = computed((): CSSProperties => {
      const { height, minHeight } = unref(getMergeProps)
      const style: CSSProperties = {}

      if (minHeight) {
        style.minHeight = typeof minHeight === 'string' ? minHeight : `${minHeight}px`
      }

      // not fullscreen state and invalid height will set
      if (height && !unref(fullscreenRef)) {
        style.height = typeof height === 'string' ? height : `${height}px`
      }

      return style
    })

    // el-dialog props
    const getBindValue = computed((): Recordable => {
      const opt: Recordable = {
        ...attrs,
        ...unref(getMergeProps),
        // basic setting
        modelValue: unref(visibleRef),
        fullscreen: unref(fullscreenRef),
        customClass: prefixCls,
        center: false,
        showClose: false,
      }

      // 设置手机端行为：手机端行为下默认全屏
      const isMobile = unref(getIsMobile)
      if (isMobile) {
        opt.fullscreen = true
        setProps({ canFullscreen: false })
      } else {
        // 还原回原来的默认值
        opt.canFullscreen && setProps({ canFullscreen: props.canFullscreen })
      }

      // 当 modal 的值为 false 时，请一定要确保 append-to-body 属性为 true
      if (props.modal === false) {
        opt.appendToBody = true
      }

      return omit(opt, [
        'visible',
        'defaultFullscreen',
        'minHeight',
        'height',
        'loading',
        'loadingTip',
        'canFullscreen',
        'showConfirmBtn',
        'showCancelBtn',
        'confirmText',
        'cancelText',
        'confirmBtnProps',
        'cancelBtnProps',
        'title',
        'helpMessage',
        'closeFunc',
      ])
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

    function setProps(modProps: Partial<BasicDialogProps>) {
      innerPropsRef.value = merge(unref(innerPropsRef), modProps)

      if (Reflect.has(modProps, 'visible')) {
        visibleRef.value = !!modProps.visible
      }

      if (Reflect.has(modProps, 'defaultFullscreen')) {
        fullscreenRef.value = !!modProps.defaultFullscreen
      }
    }

    const dialogAction: BasicDialogActionType = {
      setProps,
    }

    const instance = getCurrentInstance()
    if (instance) {
      emit('register', dialogAction, instance.uid)
    }

    watchEffect(() => {
      visibleRef.value = !!props.visible
      fullscreenRef.value = !!props.defaultFullscreen
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
      fullscreenRef,
      getBindValue,
      getMergeProps,
      getWrapperStyle,
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
    padding: 20px;

    .#{$prefixCls}-wrapper {
      position: relative;
    }
  }

  // el-dialog fullscreen class
  &.is-fullscreen {
    .el-dialog__body {
      flex: 1;
      height: 0;
      overflow-y: auto;
    }
  }

  .el-dialog__footer {
    padding: 0;

    .#{$prefixCls}-footer {
      padding: 10px 14px;
    }
  }
}
</style>
