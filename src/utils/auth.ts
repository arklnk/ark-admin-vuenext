import { KEY_TOKEN } from '/@/enums/cacheEnum'

export function getToken(): string {
  return localStorage.getItem(KEY_TOKEN) || ''
}

export function setToken(token: string) {
  localStorage.setItem(KEY_TOKEN, token)
}

export function removeToken() {
  localStorage.removeItem(KEY_TOKEN)
}
