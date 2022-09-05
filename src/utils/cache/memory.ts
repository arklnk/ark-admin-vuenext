export interface Cache<V = any> {
  value?: V
  timeoutId?: ReturnType<typeof setTimeout>
  time?: number
  alive?: number
}

export type CacheInstance<T, V> = { [key in keyof T]?: Cache<V> }

const NOT_ALIVE = 0

export class Memory<T = any, V = any> {
  private cache: CacheInstance<T, V> = {}
  private alive: number

  constructor(alive = NOT_ALIVE) {
    // seconds unit
    this.alive = alive * 1000
  }

  get getCache() {
    return this.cache
  }

  setCache(cache: CacheInstance<T, V>) {
    this.cache = cache
  }

  get<K extends keyof T>(key: K) {
    return this.cache[key]
  }

  set<K extends keyof T>(key: K, value: V, expire?: number) {
    let item = this.get(key)

    if (!expire || expire <= 0) {
      expire = this.alive
    }

    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId)
        item.timeoutId = undefined
      }
      item.value = value
    } else {
      item = { value, alive: expire }
      this.cache[key] = item
    }

    if (!expire) return

    const now = new Date().getTime()

    /**
     * Prevent overflow of the setTimeout Maximum delay value
     * Maximum delay value 2,147,483,647 ms
     * https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
     */
    item.time = expire > now ? expire : now + expire
    item.timeoutId = setTimeout(
      () => {
        this.remove(key)
      },
      expire > now ? expire - now : expire
    )
  }

  remove<K extends keyof T>(key: K) {
    const item = this.get(key)
    Reflect.deleteProperty(this.cache, key)

    if (item) {
      clearTimeout(item.timeoutId)
    }
  }

  reset(cache: CacheInstance<T, V>) {
    Object.keys(cache).forEach((key) => {
      const item = cache[key] as Cache
      if (item && item.time) {
        const now = new Date().getTime()
        const expire = item.time
        if (expire > now) {
          this.set(key as keyof T, item.value, expire)
        }
      }
    })
  }

  clear() {
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key]
      item.timeoutId && clearTimeout(item.timeoutId)
    })

    this.cache = {}
  }
}
