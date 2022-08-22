import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  set: '/param/config/set',
  page: '/param/config/page',
  add: '',
  update: '',
  delete: '',
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
    const { list } = await defHttp.get({ url: Api.set })
    return list
  }

  return [request, Api.set]
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
