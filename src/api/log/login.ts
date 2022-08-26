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

export async function getLoginLogPageRequest(
  params: PageRequestParams
): Promise<PaginationResult<LoginLog[]>> {
  return await defHttp.get({ url: Api.page, params })
}
