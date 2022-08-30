import { uniq } from 'lodash-es'
import { computed } from 'vue'
import { getDefinePermissionList } from '/@/logics/permission/helper'
import { isProdMode } from '/@/utils/env'

export interface Config {
  value?: string
  label?: string
  children?: string
  disabled?: string
}

const SEPARATOR = '/'

export function usePermissionCascader(config?: Config) {
  // 所有定义的权限集合：['sys/user/info', 'sys/user/add']
  const getConfig = computed((): Config => {
    return {
      value: 'value',
      label: 'label',
      children: 'children',
      ...(config || {}),
    }
  })

  function dig(start: number, cur: string[], op: Recordable[]) {
    const label = cur[start]
    // 查找options是否已经被重复定义
    const index = op.findIndex((e) => e.label === label)

    // 已经被定义，那么往下查询子节点
    if (index >= 0) {
      dig(start + 1, cur, op[index].children!)
      return
    }

    // 判断是否为最后一个字节点，防止超出边界
    const isLast = start === cur.length - 1

    const option: Recordable = {
      [getConfig.value.label!]: label,
      [getConfig.value.value!]: label,
      [getConfig.value.children!]: isLast ? undefined : [],
    }

    if (op) {
      op.push(option)
    }

    if (!isLast) {
      dig(start + 1, cur, op[op.length - 1].children!)
    }
  }

  function getOptions(hasPerms: string[]) {
    const auth: Recordable[] = []

    // 开发模式下则直接获取全局已经定义的权限，避免需要新增api时无法进行操作
    // 但在生产模式下则严格执行，避免越权操作
    // const handlePerms: string[] = uniq(hasPerms)
    const handlePerms: string[] = isProdMode() ? uniq(hasPerms) : getDefinePermissionList()

    handlePerms.forEach((item) => {
      const s = item.startsWith(SEPARATOR) ? item.replace(SEPARATOR, '') : item

      const arr = s.split(SEPARATOR)

      dig(0, arr, auth)
    })

    return auth
  }

  function transformValues(values: string[][]): string[] {
    return values.map((e) => e.join(SEPARATOR))
  }

  function reverseValues(values: string[]): string[][] {
    return values.map((e) => e.split(SEPARATOR))
  }

  return {
    getOptions,
    transformValues,
    reverseValues,
  }
}
