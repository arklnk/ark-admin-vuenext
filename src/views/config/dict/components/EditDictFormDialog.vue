<template>
  <BasicDialog @register="registerDialog" @confirm="submit" :title="getTitle">
    <BasicForm
      :schemas="schemas"
      :show-action-button-group="false"
      @submit="handleSubmit"
      @register="registerForm"
      label-width="110px"
    >
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">{{ t('common.basic.enable') }}</ElRadio>
          <ElRadio :label="0">{{ t('common.basic.disabled') }}</ElRadio>
        </ElRadioGroup>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { FormSchema } from '/@/components/Form'
import type { ParamConfigResult } from '/@/api/config/dict.api'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { useTransl } from '/@/composables/core/useTransl'
import { ref, computed } from 'vue'
import { DictValueTypes } from '../DictValueType'
import { isNil } from 'lodash-es'
import { useAddDictRequest, useUpdateDictRequest } from '/@/api/config/dict.api'

const emit = defineEmits(['register', 'success'])

const { t } = useTransl()

const currentParentId = ref<number>(0)
const currentUpdateId = ref<number | null>(null)

const getTitle = computed(() =>
  currentParentId.value === 0
    ? t('views.config.dict.editform.title')
    : t('views.config.dict.editform.title2')
)

const [registerForm, { submit, setProps: setFormProps, updateSchema, setFormModel }] = useForm()
const [registerDialog, { setProps: setDialogProps, closeDialog }] = useDialogInner(
  (data: { item?: ParamConfigResult; pid: number }) => {
    if (isNil(data.pid)) {
      closeDialog()
    }

    // dict id
    currentParentId.value = data.pid

    updateSchema([
      {
        prop: 'type',
        hidden: currentParentId.value === 0,
      },
      {
        prop: 'value',
        hidden: currentParentId.value === 0,
      },
      {
        prop: 'status',
        hidden: currentParentId.value === 0,
      },
    ])

    // is update
    if (data.item) {
      setFormModel(data.item)

      currentUpdateId.value = data.item.id
    } else {
      currentUpdateId.value = null
    }
  }
)

const [addDictRequest, _] = useAddDictRequest()
const [updateDictRequest, __] = useUpdateDictRequest()

async function handleSubmit(res: Omit<ParamConfigResult, 'id' | 'parentId'>) {
  try {
    setDialogProps({ confirmBtnProps: { loading: true } })
    setFormProps({ disabled: true })

    if (currentUpdateId.value === null) {
      await addDictRequest({
        ...res,
        parentId: currentParentId.value,
      })
    } else {
      await updateDictRequest({
        ...res,
        parentId: currentParentId.value,
        id: currentUpdateId.value,
      })
    }

    closeDialog()

    emit('success', currentParentId.value)
  } finally {
    setDialogProps({ confirmBtnProps: { loading: false } })
    setFormProps({ disabled: false })
  }
}

const schemas = ref<FormSchema[]>([
  {
    label: t('views.config.dict.name'),
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.config.dict.name')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.config.dict.uniqueKey'),
    prop: 'uniqueKey',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: `${t('component.form.enter')}${t('views.config.dict.uniqueKey')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.config.dict.type'),
    prop: 'type',
    defaultValue: 1,
    component: 'ElTreeSelect',
    componentProps: {
      data: DictValueTypes,
      style: 'width: 100%;',
      checkStrictly: true,
      nodeKey: 'value',
      renderAfterExpand: false,
      props: {
        label: (data: Recordable): string => {
          return t(data.label)
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 0,
      message: `${t('component.form.choose')}${t('views.config.dict.type')}`,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('views.config.dict.value'),
    prop: 'value',
    component: 'ElInput',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.sort'),
    defaultValue: 0,
    prop: 'orderNum',
    component: 'ElInputNumber',
    componentProps: {
      min: 0,
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.status'),
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
    colProps: {
      span: 12,
    },
  },
  {
    label: t('common.basic.remark'),
    prop: 'remark',
    defaultValue: '',
    component: 'ElInput',
    componentProps: {
      type: 'textarea',
      rows: 2,
    },
  },
])
</script>
