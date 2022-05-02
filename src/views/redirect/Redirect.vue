<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useGo } from '/@/hooks/web/useGo'

const { params, query } = useRoute()
const { path } = params

const _path = Array.isArray(path) ? path.join('/') : path

const go = useGo()
go({ path: _path, query }, true)
</script>
