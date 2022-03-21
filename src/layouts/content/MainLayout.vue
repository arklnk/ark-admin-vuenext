<template>
  <main class="relative w-full" :class="[d.b()]">
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

const reloadFlag = ref(true)

const d = useDesign('app-main')
</script>
