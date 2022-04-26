import { defineStore } from 'pinia'
import { usePermissionStore } from './permission'
import { getAccountInfo, logout as logoutRequest } from '/@/api/account'
import { resetRouter } from '/@/router'
import { setToken as setLocalToken, removeToken } from '/@/utils/auth'

interface UserState {
  token: string
  name: string
  avatar: string
  // 最后更新时间
  lastUpdateTime: number
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => {
    return {
      token: '',
      name: '',
      avatar: '',
      lastUpdateTime: 0,
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
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    setToken(token: string) {
      // storage token
      setLocalToken(token)
      // store token
      this.token = token
    },
    async getUserInfoAction(): Promise<void> {
      const data = await getAccountInfo()
      this.name = data!.name
      this.avatar = data!.headImg
      // 设置更新时间
      this.lastUpdateTime = new Date().getTime()
    },
    async logout(): Promise<void> {
      // can fail
      await logoutRequest()

      const permissionStore = usePermissionStore()
      this.resetState()
      permissionStore.resetState()

      resetRouter()
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
