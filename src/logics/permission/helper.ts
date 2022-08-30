import { isEmpty, isPlainObject, uniq } from 'lodash-es'
import { isProdMode } from '/@/utils/env'

/**
 * 获取所有已经定义的权限api, 为区分普通无权限的api文件定义，需要权限的均已.api.ts文件后缀命名
 */
type ApiRecord = {
  Api?: Recordable<string>
}
let definePermissionList: string[] | null = null

export function getDefinePermissionList(): string[] {
  // 生产模式下权限严格分配，根据后端返回当前用户所拥有的权限进行分配
  // 仅只有开发模式下直接获取所有权限
  if (isProdMode()) {
    return []
  }

  if (definePermissionList === null) {
    // define permssion api modules
    const defineModules: Record<string, ApiRecord> = import.meta.glob('../../api/**/*.ts', {
      eager: true,
    })

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
