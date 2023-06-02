import { listToTree } from '/@/utils/helper/tree'
import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/perm/menu/list',
  add: '/sys/perm/menu/add',
  delete: '/sys/perm/menu/delete',
  update: '/sys/perm/menu/update',
}

export interface MenuResult {
  id: number
  parent_id?: number
  name: string
  router: string
  perms: string[]
  type: number
  icon: string
  order_num: number
  view_path: string
  is_show: boolean
  active_router: string
}

export async function getMenuListRequest(): Promise<(MenuResult & { children?: MenuResult[] })[]> {
  const { list }: { list: MenuResult[] } = await defHttp.get({ url: Api.list })
  return listToTree(list)
}

export async function addMenuRequest(data: Omit<MenuResult, 'id'>) {
  return await defHttp.post({
    url: Api.add,
    data,
  })
}

export async function deleteMenuRequest(data: { id: number }) {
  return await defHttp.post({
    url: Api.delete,
    data,
  })
}

export async function updateMenuRequest(data: MenuResult) {
  return await defHttp.post({ url: Api.update, data })
}
