import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/config/dict/list',
  page: '/config/dict/data/page',
  add: '/config/dict/add',
  update: '/config/dict/update',
  delete: '/config/dict/delete',
}

export interface ParamConfigResult {
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
  value: string
}
export function useGetDictListRequest(): [PromiseFn<ParamConfigResult[]>, string] {
  async function request() {
    const { list } = await defHttp.get({ url: Api.list })
    return list
  }

  return [request, Api.list]
}

export function useGetDictDataPageRequest(): [
  PromiseFn<PageRequestParams, PaginationResult<ParamConfigResult[]>>,
  string
] {
  async function request(params: PageRequestParams) {
    return await defHttp.get({ url: Api.page, params })
  }

  return [request, Api.page]
}

export function useAddDictRequest(): [PromiseFn<Omit<ParamConfigResult, 'id'>>, string] {
  async function request(data: Omit<ParamConfigResult, 'id'>) {
    return await defHttp.post({ url: Api.add, data })
  }

  return [request, Api.add]
}

export function useUpdateDictRequest(): [PromiseFn<ParamConfigResult>, string] {
  async function request(data: ParamConfigResult) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}

export function useDeleteDictRequest(): [PromiseFn<{ id: number }>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({ url: Api.delete, data })
  }

  return [request, Api.delete]
}
