import { isNil } from 'lodash-es'

export interface CreateStorageParams {
  storage: Storage
  prefixKey: string
}

class WebStorage {
  private storage: Storage
  private prefixKey: string

  constructor({ storage, prefixKey = '' }: CreateStorageParams) {
    this.storage = storage
    this.prefixKey = prefixKey
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  /**
   * Set cache
   * @param key key
   * @param value cache value
   * @param expire expire time in seconds
   */
  set(key: string, value: any, expire: number | null): void {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: isNil(expire) ? null : new Date().getTime() + expire * 1000,
    })

    this.storage.setItem(this.getKey(key), stringData)
  }

  /**
   * Read cache
   * @param key key
   * @param def default value
   * @returns cache value
   */
  get<T = any>(key: string, def: any = null): T | null {
    const val = this.storage.getItem(this.getKey(key))
    if (!val) return def

    try {
      const data = JSON.parse(val)
      const { value, expire } = data

      // value is expire
      if (!isNil(expire) && expire <= new Date().getTime()) {
        this.remove(key)
        return null
      }

      return value
    } catch (e) {
      return def
    }
  }

  /**
   * Remove cache
   * @param key key
   */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.storage.clear()
  }
}

export function createStorage(params: CreateStorageParams) {
  return new WebStorage(params)
}
