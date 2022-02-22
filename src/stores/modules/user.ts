import { defineStore } from 'pinia'
import { setToken as setLocalToken } from '/@/utils/auth'

interface UserState {
  token: string
  name: string
  avatar: string
  /**
   * @description like this [ 'sys:user:add', 'sys:user:update' ]
   */
  ownPermssion: string[]
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => {
    return {
      token: '',
      name: '',
      avatar: '',
      ownPermssion: [],
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
    getOwnPermission(): string[] {
      return this.ownPermssion
    },
  },
  actions: {
    setToken(token: string) {
      setLocalToken(token)
    },
  },
})
