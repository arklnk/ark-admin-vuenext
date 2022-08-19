import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/dept/list',
  add: '/sys/dept/add',
  update: '/sys/dept/update',
  delete: '/sys/dept/delete',
}

export interface DeptResult {
  fullName: string
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
}

export function useGetDeptListRequest(): [PromiseFn<{ list: DeptResult[] }>, string] {
  async function request() {
    return await defHttp.get({ url: Api.list })
  }

  return [request, Api.list]
}

export function useAddDeptRequest(): [PromiseFn<Omit<DeptResult, 'id'>>, string] {
  async function request(data: Omit<DeptResult, 'id'>) {
    return await defHttp.post({ url: Api.add, data })
  }

  return [request, Api.add]
}

export function useUpdateDeptRequest(): [PromiseFn<DeptResult>, string] {
  async function request(data: DeptResult) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}

export function useDeleteDeptRequest(): [PromiseFn<{ id: number }>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({ url: Api.delete, data })
  }

  return [request, Api.delete]
}
