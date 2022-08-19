import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/job/list',
  add: '',
  update: '',
  delete: '',
}

export interface JobResult {
  id: number
  name: string
  orderNum: number
  status: number
}
export function useGetJobListRequest(): [
  PromiseFn<PageRequestParams, PaginationResult<JobResult>>,
  string
] {
  async function request(params: PageRequestParams) {
    return await defHttp.get({ url: Api.list, params })
  }

  return [request, Api.list]
}
