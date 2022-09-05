import WebStorage from './cache'
import { KEY_TOKEN } from '/@/enums/cacheEnum'

export function getToken(): string {
  return WebStorage.get(KEY_TOKEN, '', true) || ''
}

export function setToken(token: string) {
  WebStorage.set(KEY_TOKEN, token, null, true)
}

export function removeToken() {
  WebStorage.remove(KEY_TOKEN)
}
