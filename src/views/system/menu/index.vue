<template>
  <PageWrapper>
    <BasicTable
      :api="getMenuListRequest"
      :pagination="false"
      row-key="id"
      border
      @register="registerTable"
      :columns="createColumns()"
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
              disabled: !hasPermission(Api.update),
            },
            {
              label: '删除',
              popconfirm: true,
              type: 'danger',
              onClick: handleDelete.bind(null, row),
              disabled: !hasPermission(Api.delete),
            },
          ]"
        />
      </template>
    </BasicTable>
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
import { usePermission } from '/@/composables/core/usePermission'
import { createColumns } from './columns'
import { createSchemas } from './schemas'
import { createFormDialog } from '/@/components/Form'
import { filter } from '/@/utils/helper/tree'
import { ref } from 'vue'

const { hasPermission } = usePermission()

const [registerTable, { getDataSource, reload }] = useTable()

const fdInstance = createFormDialog({
  dialogProps: { title: '编辑菜单信息 ' },
  formProps: { schemas: createSchemas(), labelWidth: '110px' },
  submit: async (res: Omit<MenuResult, 'id'>, { showLoading, hideLoading, close }) => {
    try {
      showLoading()

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
      close()

      reload()
    } finally {
      hideLoading()
    }
  },
})

const updateMenuId = ref<null | number>(null)

function openEditMenuFormDialog(update?: Recordable) {
  fdInstance.open(({ getFormAction }) => {
    const tableData = getDataSource() || []
    const menus = filter(tableData, (item): boolean => {
      // 过滤权限节点，权限节点不能作为父级
      return (item.type === 0 || item.type === 1)
    })

    const menuTree = [
      {
        id: 0,
        name: '#',
        children: menus,
      },
    ]

    const updateSchema: any[] = [
      {
        prop: 'parentId',
        componentProps: {
          data: menuTree,
        },
      },
    ]

    updateSchema.push({
      prop: 'perms',
      componentProps: {
        perms: update?.perms || [],
      },
    })

    // update tree props data
    getFormAction()?.updateSchema(updateSchema)

    // is update?
    if (update) {
      const values = {
        ...update,
      }

      getFormAction()?.setFormModel(values)
      updateMenuId.value = update.id
    } else {
      updateMenuId.value = null
    }
  })
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
