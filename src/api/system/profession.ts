import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  page: '/sys/profession/page',
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

export async function getProfPageRequest(
  params: PageRequestParams
): Promise<PaginationResult<ProfessionResult[]>> {
  return await defHttp.get({ url: Api.page, params })
}

export async function addProfRequest(data: Omit<ProfessionResult, 'id'>) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateProfRequest(data: ProfessionResult) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteProfRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}
