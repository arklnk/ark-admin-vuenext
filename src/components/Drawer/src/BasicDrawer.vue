<template>
  <ElDrawer v-bind="getBindValue" :before-close="handleCancel">
    <!-- header -->
    <template #header="{ titleId, titleClass }">
      <div :id="titleId" :class="titleClass">
        <BasicHeading
          v-if="!$slots.title"
          :title="getMergeProps.title"
          :help-message="getMergeProps.helpMessage"
        />
        <slot v-else name="title"></slot>
      </div>
    </template>

    <!-- footer -->
    <template v-if="getShowFooter" #footer>
      <div :class="`${prefixCls}-footer`">
        <DrawerFooter
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
        </DrawerFooter>
        <slot v-else name="footer"></slot>
      </div>
    </template>

    <!-- content -->
    <div
      :class="`${prefixCls}-wrapper`"
      v-loading="getMergeProps.loading"
      :element-loading-text="getMergeProps.loadingTip"
    >
      <slot></slot>
    </div>
  </ElDrawer>
</template>

<script lang="ts">
import type { BasicDrawerActionType, BasicDrawerProps } from './typing'

import { computed, defineComponent, getCurrentInstance, ref, unref, watch, watchEffect } from 'vue'
import { basicProps } from './props'
import { isFunction, merge, omit } from 'lodash-es'
import { useDesign } from '/@/composables/core/useDesign'
import DrawerFooter from './components/DrawerFooter.vue'
import { BasicHeading } from '/@/components/Heading'

export default defineComponent({
  name: 'BasicDrawer',
  components: {
    DrawerFooter,
    BasicHeading,
  },
  inheritAttrs: false,
  props: basicProps,
  emits: ['register', 'confirm', 'cancel', 'update:visible', 'visible-change'],
  setup(props, { emit, attrs, expose, slots }) {
    const visibleRef = ref(false)
    const innerPropsRef = ref<Partial<BasicDrawerProps>>()

    const { prefixCls } = useDesign('basic-drawer')

    const getMergeProps = computed((): BasicDrawerProps => {
      return {
        ...props,
        ...unref(innerPropsRef),
      } as BasicDrawerProps
    })

    const getBindValue = computed((): Recordable => {
      const opt: Recordable = {
        ...attrs,
        ...unref(getMergeProps),
        // basic setting
        modelValue: unref(visibleRef),
        customClass: prefixCls,
      }

      return omit(opt, [
        'visible',
        'helpMessage',
        'loading',
        'loadingTip',
        'showConfirmBtn',
        'showCancelBtn',
        'confirmText',
        'cancelText',
        'confirmBtnProps',
        'cancelBtnProps',
        'closeFunc',
      ])
    })

    const getShowFooter = computed((): boolean => {
      const mergeProps = unref(getMergeProps)
      return (
        mergeProps.showCancelBtn ||
        mergeProps.showCancelBtn ||
        !!slots.footer ||
        !!slots.prependFooter ||
        !!slots.centerFooter ||
        !!slots.appendFooter
      )
    })

    async function handleCancel() {
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc()
        visibleRef.value = !isClose
        return
      }

      visibleRef.value = false
      emit('cancel')
    }

    function handleConfirm() {
      emit('confirm')
    }

    function setProps(modProps: Partial<BasicDrawerProps>) {
      innerPropsRef.value = merge(unref(innerPropsRef), modProps)

      if (Reflect.has(modProps, 'visible')) {
        visibleRef.value = !!modProps.visible
      }
    }

    const drawerAction: BasicDrawerActionType = {
      setProps,
    }

    expose(drawerAction)
    const instance = getCurrentInstance()
    if (instance) {
      emit('register', drawerAction, instance.uid)
    }

    watchEffect(() => {
      visibleRef.value = !!props.visible
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
      getMergeProps,
      getBindValue,
      getShowFooter,
      handleCancel,
      handleConfirm,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-drawer;

.#{$prefixCls} {
  .el-drawer__header {
    margin-bottom: 10px;
  }

  .el-drawer__body {
    padding: 20px;

    .#{$prefixCls}-wrapper {
      position: relative;
    }
  }

  .el-drawer__footer {
    padding: 0px;

    .#{$prefixCls}-footer {
      padding: 10px 14px;
    }
  }
}
</style>
