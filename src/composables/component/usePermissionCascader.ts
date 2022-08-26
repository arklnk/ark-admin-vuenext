import { computed } from 'vue'
import { getDefinePermissionList } from '/@/logics/permission/helper'

export interface Config {
  value?: string
  label?: string
  children?: string
}

const SEPARATOR = '/'

export function usePermissionCascader(config?: Config) {
  // 所有定义的权限集合：['sys/user/info', 'sys/user/add']
  const perms = getDefinePermissionList()

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

  const getOptionsRef = computed((): Recordable[] => {
    const auth: Recordable[] = []

    perms.forEach((item) => {
      const s = item.startsWith(SEPARATOR) ? item.replace(SEPARATOR, '') : item

      const arr = s.split(SEPARATOR)

      dig(0, arr, auth)
    })

    return auth
  })

  function transformValues(values: string[][], separator = '/'): string[] {
    return values.map((e) => e.join(separator))
  }

  function reverseValues(values: string[], separator = '/'): string[][] {
    return values.map((e) => e.split(separator))
  }

  return {
    getOptionsRef,
    transformValues,
    reverseValues,
  }
}
