<template>
  <ElForm
    ref="formElRef"
    v-bind="getFormBindValue"
    :class="getFormClass"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <ElRow v-bind="getRowBindValue">
      <slot name="formHeader"></slot>

      <!-- schema form item generate -->
      <template v-for="schema in getSchema" :key="`${schema.prop}`">
        <BasicFormItem
          :schema="schema"
          :form-model="formModel"
          :form-props="getProps"
          :set-prop-value="setPropValue"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </BasicFormItem>
      </template>

      <!-- form action -->
      <BasicFormAction v-bind="getProps">
        <template #[item]="data" v-for="item in ['resetBefore', 'submitBefore']">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </BasicFormAction>

      <slot name="formFooter"></slot>
    </ElRow>
  </ElForm>
</template>

<script lang="ts">
import type { BasicFormActionType, BasicFormProps, FormSchema } from './typing'
import type { FormInstance, FormItemProp } from 'element-plus'

import { computed, defineComponent, reactive, ref, unref, watch, onMounted } from 'vue'
import { basicProps } from './props'
import { useDesign } from '/@/composables/core/useDesign'
import { useFormValues } from './composables/useFormValues'
import BasicFormItem from './components/FormItem'
import { useFormEvents } from './composables/useFormEvents'
import { cloneDeep, merge, set } from 'lodash-es'
import BasicFormAction from './components/FormAction.vue'
import { createFormContext } from './composables/useFormContext'

export default defineComponent({
  name: 'BasicForm',
  components: { BasicFormItem, BasicFormAction },
  props: basicProps,
  emits: ['register', 'reset', 'submit', 'submit-failed', 'prop-value-change'],
  setup(props, { emit, attrs, expose }) {
    const innerPropsRef = ref<Partial<BasicFormProps>>()
    const schemaRef = ref<FormSchema[]>()
    const formModel = reactive<Recordable>({})
    const defaultValueRef = ref<Recordable>({})
    const formElRef = ref<Nullable<FormInstance>>(null)

    const { prefixCls } = useDesign('basic-form')

    const getProps = computed((): BasicFormProps => {
      return { ...props, ...unref(innerPropsRef) } as BasicFormProps
    })

    const getFormBindValue = computed((): Recordable => {
      return { ...attrs, ...unref(getProps) }
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
      const schemas: FormSchema[] = unref(schemaRef) || unref(getProps).schemas || []
      return cloneDeep(schemas)
    })

    const { initDefault, processFormValues } = useFormValues({
      getSchema,
      formModel,
      defaultValueRef,
      getProps,
    })

    const {
      setFormModel,
      resetFields,
      clearValidate,
      getFieldsValue,
      validate,
      validateField,
      scrollToField,
      resetSchema,
      updateSchema,
      removeSchemaByProp,
      appendSchemaByProp,
      handleSubmit,
    } = useFormEvents({
      emit,
      getProps,
      formElRef: formElRef,
      getSchema,
      formModel,
      schemaRef,
      defaultValueRef,
      processFormValues,
    })

    function setProps(formProps: Partial<BasicFormProps>) {
      innerPropsRef.value = merge(unref(innerPropsRef) || {}, formProps)
    }

    function setPropValue(prop: FormItemProp, value: any) {
      set(formModel, prop, value)
      emit('prop-value-change', prop, value)
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { submitOnEnterPress } = unref(getProps)
      if (!submitOnEnterPress) return

      if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
        // target为输入框时处理回车事件
        const target: HTMLElement = e.target as HTMLElement
        if (target.tagName && target.tagName.toUpperCase() === 'INPUT') {
          handleSubmit()
        }
      }
    }

    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit,
    })

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps)
        if (!model) return
        setFormModel(model)
      },
      {
        immediate: true,
      }
    )

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? [])
      }
    )

    watch(
      () => getSchema.value,
      () => {
        initDefault()
      }
    )

    const formActionType: BasicFormActionType = {
      scrollToField,
      resetFields,
      validate,
      validateField,
      clearValidate,
      getFieldsValue,
      setFormModel,
      setProps,
      resetSchema,
      updateSchema,
      removeSchemaByProp,
      appendSchemaByProp,
      submit: handleSubmit,
    }

    onMounted(() => {
      initDefault()
    })

    expose(formActionType)
    emit('register', formActionType)

    return {
      getFormClass,
      formModel,
      formElRef,
      getProps,
      getFormBindValue,
      getRowBindValue,
      getSchema,
      setPropValue,
      handleEnterPress,
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
