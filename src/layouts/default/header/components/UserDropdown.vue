<template>
  <ElDropdown class="text-current" placement="bottom-end" @command="handleItemClick">
    <span class="h-full inline-block flex items-center cursor-pointer">
      <ElAvatar :src="userAvatar" :size="26" @error="isLoadAvatarError = true" />
      <span class="ml-2 text-xs font-medium">{{ userName }}</span>
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem :command="PageEnum.Account">
          {{ t('routes.account') }}
        </ElDropdownItem>
        <ElDropdownItem divided :command="PageEnum.Logout">
          {{ t('layout.header.userDropdown.logout') }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { computed, ref, unref } from 'vue'
import { ElLoading } from 'element-plus'

import { useUserStore } from '/@/stores/modules/user'
import DefaultAvatar from '/@/assets/svg/user-default-avatar.svg'
import { PageEnum } from '/@/enums/pageEnum'
import { useGo } from '/@/composables/web/useGo'
import { useTransl } from '/@/composables/core/useTransl'

const { t } = useTransl()

const userStore = useUserStore()

const isLoadAvatarError = ref(false)
const userAvatar = computed(() =>
  unref(isLoadAvatarError) ? DefaultAvatar : userStore.getUserInfo?.avatar || DefaultAvatar
)
const userName = computed(() => userStore.getUserInfo?.username)

const go = useGo()
function handleItemClick(command: string) {
  if (command === '/logout') {
    const loadingIst = ElLoading.service({ fullscreen: true })

    userStore.logout().finally(() => {
      loadingIst.close()

      // redirect to login
      go(PageEnum.Login, true)
    })
  } else {
    go(command)
  }
}
</script>
