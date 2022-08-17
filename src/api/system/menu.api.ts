import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/perm/menu/list',
  add: '/sys/perm/menu/add',
  delete: '/sys/perm/menu/delete',
  update: '/sys/perm/menu/update',
}

export interface MenuResult {
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

export function useGetMenuListRequest(): [PromiseFn<{ list: MenuResult[] }>, string] {
  async function request() {
    return await defHttp.get({ url: Api.list })
  }

  return [request, Api.list]
}

export function useAddMenuRequest(): [PromiseFn<Omit<MenuResult, 'id'>>, string] {
  async function request(data: Omit<MenuResult, 'id'>) {
    return await defHttp.post({
      url: Api.add,
      data,
    })
  }

  return [request, Api.add]
}

export function useDeleteMenuRequest(): [PromiseFn<{ id: number }, void>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({
      url: Api.delete,
      data,
    })
  }

  return [request, Api.delete]
}

export function useUpdateMenuRequest(): [PromiseFn<MenuResult>, string] {
  async function request(data: MenuResult) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}
