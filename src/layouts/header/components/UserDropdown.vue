<template>
  <ElDropdown placement="bottom-end" trigger="click" @command="handleItemClick">
    <ElAvatar
      class="cursor-pointer bg-gray-200"
      :src="userAvatar"
      :size="34"
      @error="isLoadAvatarError = true"
    />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="/account/setting">账号设置</ElDropdownItem>
        <ElDropdownItem divided command="/logout">退出登录</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

import { useUserStore } from '/@/stores/modules/user'
import DefaultAvatar from '/@/assets/svg/user-default-avatar.svg'
import { PageEnum } from '/@/enums/pageEnum'

const userStore = useUserStore()

const isLoadAvatarError = ref(false)
const userAvatar = computed(() => unref(isLoadAvatarError) ? DefaultAvatar : (userStore.getUserInfo.avatar || DefaultAvatar))

const router = useRouter()
function handleItemClick(command: string) {
  if (command === '/logout') {
    const loadingIst = ElLoading.service({ fullscreen: true })

    userStore.logout().finally(() => {
      loadingIst.close()

      // redirect to login
      router.replace(PageEnum.Login)
    })
  } else {
    router.push(command)
  }
}
</script>
