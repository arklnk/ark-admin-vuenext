<template>
  <ElDropdown placement="bottom-end" @command="handleItemClick">
    <span class="h-full inline-block flex items-center cursor-pointer">
      <ElAvatar class="bg-gray-200" :src="userAvatar" :size="26" @error="isLoadAvatarError = true" />
      <span class="ml-2 text-xs font-medium">{{ userName }}</span>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="/account/setting" :icon="IconAccount">账号设置</ElDropdownItem>
        <ElDropdownItem divided command="/logout" :icon="IconTablerPower">退出系统</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

import IconTablerPower from '~icons/tabler/power'
import IconAccount from '~icons/mdi/shield-account-outline'

import { useUserStore } from '/@/stores/modules/user'
import DefaultAvatar from '/@/assets/svg/user-default-avatar.svg'
import { PageEnum } from '/@/enums/pageEnum'

const userStore = useUserStore()

const isLoadAvatarError = ref(false)
const userAvatar = computed(() => unref(isLoadAvatarError) ? DefaultAvatar : (userStore.getUserInfo.avatar || DefaultAvatar))
const userName = computed(() => userStore.getUserInfo.name)

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
