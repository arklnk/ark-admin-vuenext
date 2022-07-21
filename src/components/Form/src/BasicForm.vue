<template>
  <ElForm ref="formElRef" :class="getFormClass" :model="formModel">
    <ElRow v-bind="getRowBindValue">
      <slot name="formHeader"></slot>
      <slot name="formFooter"></slot>
    </ElRow>
  </ElForm>
</template>

<script lang="ts">
import type { BasicFormProps, FormSchema } from './typing'
import type { FormInstance } from 'element-plus'

import { computed, defineComponent, onMounted, reactive, ref, unref } from 'vue'
import { basicProps } from './props'
import { useDesign } from '/@/composables/core/useDesign'
import { useFormValues } from './composables/useFormValues'

export default defineComponent({
  name: 'BasicForm',
  props: basicProps,
  emits: ['register', 'reset', 'submit', 'submit-failed'],
  setup(props) {
    const innerPropsRef = ref<Partial<BasicFormProps>>()
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formModel = reactive<Recordable>({})
    const defaultValueRef = ref<Recordable>({})
    const formElRef = ref<Nullable<FormInstance>>(null)

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

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] = unref(schemaRef) || unref(getProps).schemas
      return schemas
    })

    const { initDefault } = useFormValues({ getSchema, formModel, defaultValueRef, getProps })

    onMounted(() => {
      initDefault()
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
