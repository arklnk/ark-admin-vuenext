<template>
  <PageWrapper content-full-height fixed-height>
    <BasicTable :data-source="[]" :api="mockData" border class="h-full" height="100%">
      <ElTableColumn label="参数名称" prop="name" align="center" />
      <ElTableColumn label="参数值" prop="value" align="center" />
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
import { PageWrapper } from '/@/components/Page'
import { BasicTable } from '/@/components/Table'

function mockData(params: Recordable) {
  console.log(params)
  return new Promise((resolve: Fn) => {
    setTimeout(() => {
      const result = []
      for (let i = 0; i < params.size; i++) {
        result.push({
          id: i,
          name: 'haha' + i,
          value: 'woc' + i,
        })
      }
      resolve({
        list: result,
        pagination: {
          total: result.length,
        },
      })
    }, 2000)
  })
}
</script>
