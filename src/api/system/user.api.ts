import type { PageRequestParams } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/user/list',
  add: '/sys/user/add',
  update: '/sys/user/update',
  delete: '/sys/user/delete',
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
export function useGetUserListRequest(): [
  PromiseFn<PageRequestParams & { deptId: number }, UserResult>,
  string
] {
  async function request(params: PageRequestParams & { deptId: number }) {
    return await defHttp.get({ url: Api.list, params })
  }

  return [request, Api.list]
}

export type UserRequestParams = Omit<UserResult, 'id' | 'job' | 'profession' | 'roles' | 'dept'> & {
  professionId: number
  roleIds: number[]
  jobId: number
  deptId: number
  avatar: string
}
export function useAddUserRequest(): [PromiseFn<UserRequestParams>, string] {
  async function request(data: UserRequestParams) {
    return await defHttp.post({ url: Api.add, data })
  }

  return [request, Api.add]
}

export function useUpdateUserRequest(): [PromiseFn<UserRequestParams & { id: number }>, string] {
  async function request(data: UserRequestParams & { id: number }) {
    return await defHttp.post({ url: Api.update, data })
  }

  return [request, Api.update]
}

export function useDeleteUserRequest(): [PromiseFn<{ id: number }>, string] {
  async function request(data: { id: number }) {
    return await defHttp.post({ url: Api.delete, data })
  }

  return [request, Api.delete]
}
