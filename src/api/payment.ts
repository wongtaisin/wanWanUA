import { request } from '@/api/request'

export const paymentAll = async () => {
  const res: any = await request('/payment/all', 'GET')
  return res
}
