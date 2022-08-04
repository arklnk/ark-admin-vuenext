<template>
  <div>
    <RedoSetting />
    <SizeSetting />
    <FullscreenSetting />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FullscreenSetting from './FullscreenSetting.vue'
import RedoSetting from './RedoSetting.vue'
import SizeSetting from './SizeSetting.vue'

export default defineComponent({
  name: 'BasicTableToolbar',
  components: {
    FullscreenSetting,
    RedoSetting,
    SizeSetting,
  },
  setup() {},
})
</script>
