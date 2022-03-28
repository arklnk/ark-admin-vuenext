<template>
  <ElDropdown placement="bottom-end" trigger="click">
    <ElAvatar
      class="cursor-pointer bg-transparent"
      :src="userAvatar"
      :size="34"
      @error="isLoadAvatarError = true"
    />
    <template #dropdown>
      <ElDropdown-menu>
        <ElDropdownItem>账号设置</ElDropdownItem>
        <ElDropdownItem divided>退出登录</ElDropdownItem>
      </ElDropdown-menu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useUserStore } from '/@/stores/modules/user'
import DefaultAvatar from '/@/assets/svg/user-default-avatar.svg'

const isLoadAvatarError = ref(false)
const userStore = useUserStore()
const userAvatar = computed(() => unref(isLoadAvatarError) ? DefaultAvatar : (userStore.getUserInfo.avatar || DefaultAvatar))
</script>
