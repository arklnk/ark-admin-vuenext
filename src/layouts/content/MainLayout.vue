<template>
  <main class="relative w-full" :class="[d.b(), d.is('fixed', getFixed)]">
    <RouterView v-if="reloadFlag" v-slot="{ Component }">
      <Transition name="fade-bottom" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDesign } from '/@/hooks/core/useDesign'
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'

const reloadFlag = ref(true)

const d = useDesign('app-main')
const { getFixed } = useHeaderSetting()
</script>

<style lang="scss" scoped>
@use '/@/styles/var.scss';
@use '/@/styles/mixins.scss' as *;

@include b(app-main) {
  @include when(fixed) {
    padding-top: var.$navBarHeight;
  }
}
</style>
