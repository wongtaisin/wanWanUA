import { request } from '@/api/request'

export const earnCheckDatePrice = async (params: any) => {
  const res: any = await request('/earn/checkDatePrice', 'GET', params)
  return res
}
