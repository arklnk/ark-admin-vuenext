import { listToTree } from '/@/utils/helper/tree'
import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/dept/list',
  add: '/sys/dept/add',
  update: '/sys/dept/update',
  delete: '/sys/dept/delete',
}

export interface DeptResult {
  fullName: string
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
}

export async function getDeptListRequest(): Promise<(DeptResult & { children?: DeptResult[] })[]> {
  const { list }: { list: DeptResult[] } = await defHttp.get({ url: Api.list })
  return listToTree(list)
}

export async function addDeptRequest(data: Omit<DeptResult, 'id'>) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateDeptRequest(data: DeptResult) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteDeptRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}
