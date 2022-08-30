<template>
  <BasicDialog @register="registerDialog" title="编辑部门信息" @confirm="submit">
    <BasicForm @register="registerForm" @submit="handleSubmit">
      <template #status="{ model }">
        <ElRadioGroup v-model="model.status">
          <ElRadio :label="1">启用</ElRadio>
          <ElRadio :label="0">禁用</ElRadio>
        </ElRadioGroup>
      </template>
      <template #type="{ model }">
        <ElSelect v-model="model.type" class="w-full">
          <ElOption label="公司" :value="1" />
          <ElOption label="子公司" :value="2" />
          <ElOption label="部门" :value="3" />
        </ElSelect>
      </template>
    </BasicForm>
  </BasicDialog>
</template>

<script setup lang="ts">
import type { DeptResult } from '/@/api/system/dept'

import { BasicDialog, useDialogInner } from '/@/components/Dialog'
import { BasicForm, useForm } from '/@/components/Form'
import { ref } from 'vue'
import { addDeptRequest, updateDeptRequest } from '/@/api/system/dept'

const emit = defineEmits(['register', 'success'])

const updateDeptId = ref<number | null>(null)

const [registerForm, { updateSchema, submit, setProps: setFormProps, setFormModel }] = useForm({
  showActionButtonGroup: false,
  labelWidth: '100px',
  schemas: [
    {
      label: '部门名称',
      defaultValue: '',
      prop: 'name',
      colProps: {
        span: 12,
      },
      component: 'ElInput',
      rules: {
        required: true,
        type: 'string',
        message: '请输入部门名称',
      },
    },
    {
      label: '部门标识',
      defaultValue: '',
      prop: 'uniqueKey',
      component: 'ElInput',
      colProps: {
        span: 12,
      },
      rules: {
        required: true,
        type: 'string',
        message: '请输入部门标识',
      },
    },
    {
      label: '父级部门',
      defaultValue: 0,
      prop: 'parentId',
      component: 'ElTreeSelect',
      componentProps: {
        style: 'width: 100%;',
        nodeKey: 'id',
        data: [],
        checkStrictly: true,
        defaultExpandAll: true,
        props: {
          label: (data: DeptResult): string => {
            return data.name
          },
        },
      },
      rules: {
        required: true,
        type: 'number',
        min: 0,
      },
    },
    {
      label: '部门类型',
      defaultValue: 1,
      prop: 'type',
      slot: 'type',
      colProps: {
        span: 12,
      },
    },
    {
      label: '部门全称',
      defaultValue: '',
      prop: 'fullName',
      component: 'ElInput',
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
        rows: 3,
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
  ],
})

const [registerDialog, { setProps, closeDialog }] = useDialogInner(
  (data: { list: DeptResult[]; item: DeptResult }) => {
    const deptTree = [
      {
        id: 0,
        name: '#',
        children: data.list || [],
      },
    ]

    updateSchema({
      prop: 'parentId',
      componentProps: {
        data: deptTree,
      },
    })

    // is update?
    if (data.item) {
      updateDeptId.value = data.item.id
      setFormModel(data.item)
    } else {
      updateDeptId.value = null
    }
  }
)

async function handleSubmit(res: Omit<DeptResult, 'id'>) {
  try {
    setFormProps({ disabled: true })
    setProps({ confirmBtnProps: { loading: true } })

    if (updateDeptId.value === null) {
      await addDeptRequest(res)
    } else {
      await updateDeptRequest({
        ...res,
        id: updateDeptId.value,
      })
    }

    closeDialog()

    emit('success')
  } finally {
    setFormProps({ disabled: false })
    setProps({ confirmBtnProps: { loading: false } })
  }
}
</script>
