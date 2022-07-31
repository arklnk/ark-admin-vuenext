<template>
  <PageWrapper>
    <BasicTable
      ref="tableRef"
      :data-source="[]"
      :api="mockData"
      border
      :pagination="{
        pageSizes: [50, 100, 200, 300],
      }"
      row-key="id"
      :row-selection="{
        type: 'radio',
        clearOnPageChange: false,
        selectable,
        selectedRowKeys: [1],
      }"
      class="h-full"
      :columns="columns"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageWrapper } from '/@/components/Page'
import { BasicTable, Column } from '/@/components/Table'

const tableRef = ref(null)

const total = 1000

const columns: Column[] = [
  {
    label: '多级表头',
    align: 'center',
    children: [
      {
        label: '参数名称',
        prop: 'name',
        align: 'center',
      },
      {
        label: '参数值',
        prop: 'value',
        align: 'center',
      },
    ],
  },
]

function selectable(record: Recordable): boolean {
  return record.id % 2 === 0
}

function mockData(params: Recordable) {
  return new Promise((resolve: Fn) => {
    setTimeout(() => {
      const result: any[] = []
      const lastSize = (params.page - 1) * params.size
      for (let i = 0; i < params.size; i++) {
        result.push({
          id: i + lastSize,
          name: 'haha' + i,
          value: 'woc' + i,
        })
      }
      resolve({
        list: result,
        pagination: {
          total,
        },
      })
    }, 1000)
  })
}
</script>
