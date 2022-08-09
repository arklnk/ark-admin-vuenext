import { isEmpty, isPlainObject, uniq } from 'lodash-es'

/**
 * 获取所有已经定义的权限api, 为区分普通无权限的api文件定义，需要权限的均已.api.ts文件后缀命名
 */
type ApiRecord = {
  Api: Recordable<string>
}
let definePermModules: Record<string, ApiRecord>

export function getDefinePermList(): string[] {
  definePermModules = definePermModules || import.meta.globEager('../../api/**/*.api.ts')

  const keys = Object.keys(definePermModules)
  let permList: string[] = []

  keys.forEach((k) => {
    const define = definePermModules[k]

    if (isEmpty(define.Api) || !isPlainObject(define.Api)) return

    const api = Object.values(define.Api)
    if (Array.isArray(api) && api.length > 0) {
      permList.concat(api)
    }
  })

  permList = uniq(permList)

  return permList
}
