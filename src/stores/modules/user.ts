import { defineStore } from 'pinia'
import { usePermissionStore } from './permission'
import { getAccountInfo, logout as logoutRequest } from '/@/api/account'
import { setToken as setLocalToken, removeToken } from '/@/utils/auth'

interface UserState {
  token: string
  name: string
  avatar: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => {
    return {
      token: '',
      name: '',
      avatar: '',
    }
  },
  getters: {
    getToken(): string {
      return this.token
    },
    getUserInfo(): Pick<UserState, 'name' | 'avatar'> {
      return {
        name: this.name,
        avatar: this.avatar,
      }
    },
  },
  actions: {
    setToken(token: string) {
      // storage token
      setLocalToken(token)
      // store token
      this.token = token
    },
    async initUserInfo(): Promise<void> {
      const { data } = await getAccountInfo()
      this.name = data!.name
      this.avatar = data!.headImg
    },
    logout(): void {
      const permissionStore = usePermissionStore()
      logoutRequest().catch(() => {})
      this.resetState()
      permissionStore.resetState()
    },
    resetState(): void {
      // remove storage token
      removeToken()
      // store
      this.token = ''
      this.name = ''
      this.avatar = ''
    },
  },
})
