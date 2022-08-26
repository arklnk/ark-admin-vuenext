import { listToTree } from '/@/utils/helper/tree'
import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/role/list',
  add: '/sys/role/add',
  update: '/sys/role/update',
  delete: '/sys/role/delete',
}

export interface RoleResult {
  id: number
  name: string
  orderNum: number
  parentId: number
  remark: string
  status: number
  uniqueKey: string
  permMenuIds: number[]
}

export async function getRoleListRequest(): Promise<(RoleResult & { children?: RoleResult[] })[]> {
  const { list }: { list: RoleResult[] } = await defHttp.get({ url: Api.list })
  return listToTree(list)
}

export async function addRoleRequest(data: Omit<RoleResult, 'id'>) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateRoleRequest(data: RoleResult) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteRoleRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}
