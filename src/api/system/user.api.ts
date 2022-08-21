import type { PageRequestParams } from '/#/axios'

import { defHttp } from '/@/utils/http/axios'

export const Api = {
  list: '/sys/user/list',
  add: '',
  update: '',
  delete: '',
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
