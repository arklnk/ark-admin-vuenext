import type { PageRequestParams, PaginationResult } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  page: '/sys/user/page',
  add: '/sys/user/add',
  update: '/sys/user/update',
  delete: '/sys/user/delete',
  rdpj: '/sys/user/rdpj/info',
  pwd: '/sys/user/password/update',
}

interface IdNameRecord {
  id: number
  name: string
}
export interface UserResult {
  account: string
  avatar: string
  birthday: string
  dept: IdNameRecord
  email: string
  gender: number
  id: number
  job: IdNameRecord
  mobile: string
  nickname: string
  orderNum: number
  profession: IdNameRecord
  remark: string
  roles: IdNameRecord[]
  status: number
  username: string
}
export async function getUserPageRequest(
  params: PageRequestParams & { deptId: number }
): Promise<PaginationResult<UserResult>> {
  return await defHttp.get({ url: Api.page, params })
}

export type UserRequestParams = Omit<UserResult, 'id' | 'job' | 'profession' | 'roles' | 'dept'> & {
  professionId: number
  roleIds: number[]
  jobId: number
  deptId: number
  avatar: string
}

export async function addUserRequest(data: UserRequestParams) {
  return await defHttp.post({ url: Api.add, data })
}

export async function updateUserRequest(data: UserRequestParams & { id: number }) {
  return await defHttp.post({ url: Api.update, data })
}

export async function deleteUserRequest(data: { id: number }) {
  return await defHttp.post({ url: Api.delete, data })
}

interface RDPJInfoResult {
  role: IdNameRecord[]
  profession: IdNameRecord[]
  job: IdNameRecord[]
  dept: IdNameRecord[]
}

export async function getRDPJInfoRequest(params?: { userId: number }): Promise<RDPJInfoResult> {
  return await defHttp.get({ url: Api.rdpj, params })
}

export async function updateUserPwdRequest(data: { id: number; password: string }) {
  return await defHttp.post({ url: Api.pwd, data })
}
