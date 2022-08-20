import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/profession/list',
  add: '/sys/profession/add',
  update: '/sys/profession/update',
  delete: '/sys/profession/delete',
}

export interface ProfessionResult {
  id: number
  name: string
  orderNum: number
  status: number
}

export function useGetProfListRequest(): [
  PromiseFn<PageRequestParams, PaginationResult<ProfessionResult[]>>,
  string
] {
  async function request(params: PageRequestParams) {
    return await defHttp.get({ url: Api.list, params })
  }

  return [request, Api.list]
}

export function useAddProfRequest(): [PromiseFn<Omit<ProfessionResult, 'id'>>, string] {
  async function request(data: Omit<ProfessionResult, 'id'>) {
    return await defHttp.post({ url: Api.add, data })
  }

  return [request, Api.add]
}

export function useUpdateProfRequest(): [PromiseFn<ProfessionResult>, string] {
  async function request(data: ProfessionResult) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}

export function useDeleteProfRequest(): [PromiseFn<{ id: number }>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({ url: Api.delete, data })
  }

  return [request, Api.delete]
}
