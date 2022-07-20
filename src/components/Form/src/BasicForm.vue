<template>
  <ElForm ref="formElRef" :class="getFormClass" :model="formModel">
    <ElRow v-bind="getRowBindValue">Form</ElRow>
  </ElForm>
</template>

<script lang="ts">
import type { BasicFormProps, FormSchema } from './typing'

import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { basicProps } from './props'
import { useDesign } from '/@/composables/core/useDesign'

export default defineComponent({
  name: 'BasicForm',
  props: basicProps,
  emits: ['register'],
  setup(props) {
    const innerPropsRef = ref<Partial<BasicFormProps>>()
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formModel = reactive<Recordable>({})
    const formElRef = ref(null)

    const { prefixCls } = useDesign('basic-form')

    const getProps = computed((): BasicFormProps => {
      return { ...props, ...unref(innerPropsRef) } as BasicFormProps
    })

    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
        },
      ]
    })

    const getRowBindValue = computed((): Recordable => {
      const { rowStyle = {}, rowProps } = unref(getProps)
      return {
        style: rowStyle,
        ...rowProps,
      }
    })

    return {
      getFormClass,
      formModel,
      formElRef,
      getRowBindValue,
    }
  },
})
</script>

<style lang="scss">
@use '/@/styles/var.scss';

$prefixCls: #{var.$namespace}-basic-form;

.#{$prefixCls} {
  &--compact {
    .el-form-item {
      margin-bottom: 8px;
    }
  }
}
</style>
