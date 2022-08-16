import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/perm/menu/list',
}

interface MenuListResult {
  id: number
  parentId?: number
  name: string
  router: string
  perms: string[]
  type: number
  icon: string
  orderNum: number
  viewPath: string
  isShow: boolean
  activeRouter: string
}
export function getMenuList(): [() => Promise<{ list: MenuListResult[] }>, string] {
  async function request() {
    return await defHttp.get({ url: Api.list })
  }
  return [request, Api.list]
}
