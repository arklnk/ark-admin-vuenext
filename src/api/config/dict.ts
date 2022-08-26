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
export async function getDictListRequest(): Promise<ParamConfigResult[]> {
  const { list } = await defHttp.get({ url: Api.list })
  return list
}

export async function getDictDataPageRequest(
  params: PageRequestParams
): Promise<PaginationResult<ParamConfigResult[]>> {
  return await defHttp.get({ url: Api.page, params })
}

export async function addDictRequest(data: Omit<ParamConfigResult, 'id'>) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateDictRequest(data: Omit<ParamConfigResult, 'uniqueKey'>) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteDictRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}
