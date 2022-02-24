import { defineStore } from 'pinia'
import { setToken as setLocalToken, getToken as getLocalToken } from '/@/utils/auth'

interface UserState {
  token: string
  name: string
  avatar: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => {
    const localToken = getLocalToken()
    return {
      token: localToken,
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
      setLocalToken(token)
    },
    fetchUserInfo() {},
  },
})
