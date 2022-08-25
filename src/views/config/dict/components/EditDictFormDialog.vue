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
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
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
import { ref, computed } from 'vue'
import { DictValueTypes } from '../DictValueType'
import { isNil, omit } from 'lodash-es'
import { useAddDictRequest, useUpdateDictRequest } from '/@/api/config/dict.api'

const emit = defineEmits(['register', 'success'])

const currentParentId = ref<number>(0)
const currentUpdateId = ref<number | null>(null)

const getTitle = computed(() => (currentParentId.value === 0 ? '编辑字典信息' : '编辑字典项信息'))

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
      {
        prop: 'uniqueKey',
        componentProps: {
          disabled: !!data.item,
        },
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
        ...omit(res, 'uniqueKey'),
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
    label: '名称',
    prop: 'name',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入名称',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '标识',
    prop: 'uniqueKey',
    defaultValue: '',
    component: 'ElInput',
    rules: {
      required: true,
      type: 'string',
      message: '请输入标识',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '值类型',
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
          return data.label
        },
      },
    },
    rules: {
      required: true,
      type: 'number',
      min: 0,
      message: '请选择值类型',
    },
    colProps: {
      span: 12,
    },
  },
  {
    label: '字典项值',
    prop: 'value',
    component: 'ElInput',
    defaultValue: '',
    colProps: {
      span: 12,
    },
  },
  {
    label: '排序',
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
    label: '状态',
    defaultValue: 1,
    prop: 'status',
    slot: 'status',
    colProps: {
      span: 12,
    },
  },
  {
    label: '备注',
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
