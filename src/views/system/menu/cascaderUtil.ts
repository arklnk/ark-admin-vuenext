import type { MenuResult } from '/@/api/system/menu'

import { flatten, uniq } from 'lodash-es'
import { treeToList, filter } from '/@/utils/helper/tree'

const SEPARATOR = '/'

export function transformCascaderOptions(tableData: Recordable[]) {
  // 获取可操作的权限
  const perms: string[] = flatten(
    treeToList(filter(tableData, (item): boolean => item.type === 2 && item.has !== 0)).map(
      (item: MenuResult) => item.perms
    )
  )

  const auth: Recordable[] = []

  const handlePerms = uniq(perms)

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
      label: label,
      value: label,
      children: isLast ? undefined : [],
    }

    if (op) {
      op.push(option)
    }

    if (!isLast) {
      dig(start + 1, cur, op[op.length - 1].children!)
    }
  }

  handlePerms.forEach((item) => {
    const s = item.startsWith(SEPARATOR) ? item.replace(SEPARATOR, '') : item

    const arr = s.split(SEPARATOR)

    dig(0, arr, auth)
  })

  return auth
}

export function transformValues(values: string[][]): string[] {
  return values.map((e) => e.join(SEPARATOR))
}

export function reverseValues(values: string[]): string[][] {
  return values.map((e) => e.split(SEPARATOR))
}
