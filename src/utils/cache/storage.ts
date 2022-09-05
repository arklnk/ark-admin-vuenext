import { isNil } from 'lodash-es'
import { createAESCipherOptions, decryptByAES, encryptByAES } from '../cipher'
import { CipherIv, CipherKey } from '/@/settings/encryptionSetting'

export interface CreateStorageParams {
  storage: Storage
  prefixKey: string
}

class WebStorage {
  private storage: Storage
  private prefixKey: string
  private cipherOptions: Recordable
  private cipherKey: string

  constructor({ storage, prefixKey = '' }: CreateStorageParams) {
    this.storage = storage
    this.prefixKey = prefixKey

    // aes cipher
    this.cipherOptions = createAESCipherOptions(CipherIv)
    this.cipherKey = CipherKey
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
  set(key: string, value: any, expire: number | null = null, encrypt = false): void {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: isNil(expire) ? null : new Date().getTime() + expire * 1000,
    })

    // aes encrypt value or narmal value
    const storageValue = encrypt
      ? encryptByAES(stringData, this.cipherKey, this.cipherOptions)
      : stringData

    this.storage.setItem(this.getKey(key), storageValue)
  }

  /**
   * Read cache
   * @param key key
   * @param def default value
   * @returns cache value
   */
  get<T = any>(key: string, def: any = null, encrypt = false): T | null {
    const val = this.storage.getItem(this.getKey(key))
    if (!val) return def

    try {
      // aes decrypt or normal value
      const devVal = encrypt ? decryptByAES(val, this.cipherKey, this.cipherOptions) : val
      const data = JSON.parse(devVal)

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
