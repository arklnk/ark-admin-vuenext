<template>
  <PageWrapper>
    <BasicTable
      :api="getMenuListRequest"
      :pagination="false"
      row-key="id"
      border
      @register="registerTable"
    >
      <!-- toolbar -->
      <template #toolbar>
        <ElButton
          type="primary"
          @click="openEditMenuFormDialog()"
          :disabled="!hasPermission(Api.add)"
        >
          新增
        </ElButton>
      </template>

      <!-- column -->
      <template #name="{ row }">
        {{ row.name }}
        <ElTag v-if="row.isShow === 0 && row.type !== 2" type="danger">隐藏</ElTag>
      </template>
      <template #type="{ row }">
        <ElTag>{{ formatMenuType(row.type) }}</ElTag>
      </template>
      <template #perms="{ row }">
        <ElTag v-for="item in row.perms" :key="item" class="mr-1 mt-0.75">{{ item }}</ElTag>
      </template>
      <template #icon="{ row }">
        <span v-if="row.icon" :class="`i-${row.icon}`"></span>
      </template>

      <template #action="{ row }">
        <BasicTableAction
          :actions="[
            {
              label: '编辑',
              onClick: openEditMenuFormDialog.bind(null, row),
              disabled: row.has === 0 || !hasPermission(Api.update),
            },
            {
              label: '删除',
              popconfirm: true,
              type: 'danger',
              onClick: handleDelete.bind(null, row),
              disabled: row.has === 0 || !hasPermission(Api.delete),
            },
          ]"
        />
      </template>
    </BasicTable>

    <!-- form -->
    <FormDialogRender
      :form-props="{ schemas, labelWidth: '110px' }"
      :dialog-props="{ title: '编辑菜单信息 ' }"
      :handle-submit="handleSubmit"
    >
      <template #type="{ model }">
        <ElRadioGroup v-model="model.type">
          <ElRadio :label="0">目录</ElRadio>
          <ElRadio :label="1">菜单</ElRadio>
          <ElRadio :label="2">权限</ElRadio>
        </ElRadioGroup>
      </template>
      <template #isShow="{ model }">
        <ElRadioGroup v-model="model.isShow">
          <ElRadio :label="1">显示</ElRadio>
          <ElRadio :label="0">隐藏</ElRadio>
        </ElRadioGroup>
      </template>
      <template #viewPath="{ model }">
        <ElSelect v-model="model.viewPath" class="w-full" clearable allow-create filterable>
          <ElOption v-for="item in allDynamicImportViews" :key="item" :label="item" :value="item" />
        </ElSelect>
      </template>
    </FormDialogRender>
  </PageWrapper>
</template>

<script setup lang="ts">
import type { MenuResult } from '/@/api/system/menu'

import { PageWrapper } from '/@/components/Page'
import { BasicTable, useTable, BasicTableAction } from '/@/components/Table'
import {
  getMenuListRequest,
  deleteMenuRequest,
  Api,
  addMenuRequest,
  updateMenuRequest,
} from '/@/api/system/menu'
import { getDynamicImportViews } from '/@/router/helper/routeHelper'
import { usePermission } from '/@/composables/core/usePermission'
import { columns } from './columns'
import { schemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { filter, treeToList } from '/@/utils/helper/tree'
import { flatten } from 'lodash-es'
import { ref } from 'vue'
import { usePermissionCascader } from '/@/composables/component/usePermissionCascader'

const { hasPermission } = usePermission()

const allDynamicImportViews = getDynamicImportViews()
const { transformValues, reverseValues, getOptions } = usePermissionCascader()

const [registerTable, { getDataSource, reload }] = useTable({
  columns,
})

const FormDialogRender = createFormDialog()

const updateMenuId = ref<null | number>(null)

function openEditMenuFormDialog(update?: Recordable) {
  FormDialogRender.open((_, formAction) => {
    const tableData = getDataSource() || []
    const menus = filter(tableData, (item): boolean => {
      // 过滤权限节点，权限节点不能作为父级
      return (item.type === 0 || item.type === 1) && item.has !== 0
    })
    const menuTree = [
      {
        id: 0,
        name: '#',
        children: menus,
      },
    ]

    // 获取可操作的权限
    const perms: string[] = flatten(
      treeToList(filter(tableData, (item): boolean => item.type === 2 && item.has !== 0)).map(
        (item: MenuResult) => item.perms
      )
    )

    // 转换成ElCascader所需要的options格式
    const options = getOptions(perms)

    // update tree props data
    formAction.updateSchema([
      {
        prop: 'parentId',
        componentProps: {
          data: menuTree,
        },
      },
      {
        prop: 'perms',
        componentProps: {
          options,
        },
      },
    ])

    // is update?
    if (update) {
      const values = {
        ...update,
        perms: reverseValues(update.perms),
      }
      formAction.setFormModel(values)
      updateMenuId.value = update.id
    } else {
      updateMenuId.value = null
    }
  })
}

async function handleSubmit(res: Omit<MenuResult, 'id'>) {
  try {
    FormDialogRender.setFormProps({ disabled: true })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: true } })

    // 转换权限值
    if (res.type === 2) {
      res.perms = transformValues(res.perms as unknown as string[][])
    }

    // 未实现，默认处理
    res.activeRouter = ''

    if (updateMenuId.value === null) {
      await addMenuRequest(res)
    } else {
      await updateMenuRequest({
        ...res,
        id: updateMenuId.value,
      })
    }

    // close
    FormDialogRender.close()

    reload()
  } finally {
    FormDialogRender.setFormProps({ disabled: false })
    FormDialogRender.setDialogProps({ confirmBtnProps: { loading: false } })
  }
}

async function handleDelete(row: Recordable) {
  await deleteMenuRequest({ id: row.id })
  reload()
}

function formatMenuType(type: number) {
  switch (type) {
    case 0:
      return '目录'
    case 1:
      return '菜单'
    case 2:
      return '权限'
  }
}
</script>
