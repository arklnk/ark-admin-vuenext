import { isEmpty, isPlainObject, uniq } from 'lodash-es'

/**
 * 获取所有已经定义的权限api, 为区分普通无权限的api文件定义，需要权限的均已.api.ts文件后缀命名
 */
type ApiRecord = {
  Api?: Recordable<string>
}
let definePermissionList: string[] | null = null

export function getDefinePermissionList(): string[] {
  if (definePermissionList === null) {
    // define permssion api modules
    const defineModules: Record<string, ApiRecord> = import.meta.globEager('../../api/**/*.ts')

    const keys = Object.keys(defineModules)
    let permList: string[] = []

    keys.forEach((k) => {
      const define = defineModules[k]

      if (!isPlainObject(define.Api) || isEmpty(define.Api)) return

      const api = Object.values(define.Api!)
      if (Array.isArray(api) && api.length > 0) {
        permList.push(...api)
      }
    })

    // 过滤重复定义的api
    permList = uniq(permList)

    // 缓存
    definePermissionList = permList
  }

  return definePermissionList
}
