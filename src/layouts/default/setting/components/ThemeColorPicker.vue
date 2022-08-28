<template>
  <div class="flex flex-wrap justify-around">
    <template v-for="color in colorList" :key="color">
      <span
        class="inline-block relative w-4 h-4 cursor-pointer relative text-xs leading-4 text-center border border-gray-200"
        :style="{ backgroundColor: color }"
        @click="handleClick(color)"
      >
        <span v-if="cursor === color" class="i-ic:twotone-check text-gray-300"></span>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'change', color: string): void }>()

defineProps({
  colorList: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  cursor: {
    type: String,
    required: true,
  },
})

function handleClick(color: string) {
  emit('change', color)
}
</script>
