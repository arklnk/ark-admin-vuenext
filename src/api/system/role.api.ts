import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/role/list',
}

export interface RoleResult {
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
}
export function useGetRoleListRequest(): [PromiseFn<{ list: RoleResult[] }>, string] {
  async function request() {
    return await defHttp.get({ url: Api.list })
  }

  return [request, Api.list]
}
