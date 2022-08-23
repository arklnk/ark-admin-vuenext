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
export function useGetConfigSetRequest(): [PromiseFn<ParamConfigResult[]>, string] {
  async function request() {
    const { list } = await defHttp.get({ url: Api.list })
    return list
  }

  return [request, Api.list]
}

export function useGetConfigPageRequest(): [
  PromiseFn<PageRequestParams, PaginationResult<ParamConfigResult[]>>,
  string
] {
  async function request(params: PageRequestParams) {
    return await defHttp.get({ url: Api.page, params })
  }

  return [request, Api.page]
}
