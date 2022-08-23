import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  page: '/log/login/page',
  delete: '/log/login/delete',
}

export interface LoginLog {
  account: string
  id: number
  ip: string
  status: number
  uri: string
  createTime: string
}
export function useGetLoginLogPageRequest(): [
  PromiseFn<PageRequestParams, PaginationResult<LoginLog[]>>,
  string
] {
  async function request(params: PageRequestParams) {
    return await defHttp.get({ url: Api.page, params })
  }

  return [request, Api.page]
}
