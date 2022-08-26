import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  page: '/sys/job/page',
  add: '/sys/job/add',
  update: '/sys/job/update',
  delete: '/sys/job/delete',
}

export interface JobResult {
  id: number
  name: string
  orderNum: number
  status: number
}
export async function getJobPageRequest(
  params: PageRequestParams
): Promise<PaginationResult<JobResult>> {
  return await defHttp.get({ url: Api.page, params })
}

export async function addJobRequest(data: Omit<JobResult, 'id'>) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateJobRequest(data: JobResult) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteJobRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}
