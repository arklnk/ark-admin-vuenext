import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/role/list',
  add: '/sys/role/add',
  update: '/sys/role/update',
  delete: '/sys/role/delete',
}

export interface RoleResult {
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
  permMenuIds: number[]
}
export function useGetRoleListRequest(): [PromiseFn<{ list: RoleResult[] }>, string] {
  async function request() {
    return await defHttp.get({ url: Api.list })
  }

  return [request, Api.list]
}

export function useAddRoleRequest(): [PromiseFn<Omit<RoleResult, 'id'>>, string] {
  async function request(data: Omit<RoleResult, 'id'>) {
    return await defHttp.post({ url: Api.add, data })
  }

  return [request, Api.add]
}

export function useUpdateRoleRequest(): [PromiseFn<RoleResult>, string] {
  async function request(data: RoleResult) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}

export function useDeleteRoleRequest(): [PromiseFn<{ id: number }>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({ url: Api.delete, data })
  }

  return [request, Api.delete]
}
