import { request } from '@/api/request'

export const ledgerList = async (params: any) => {
  const res: any = await request('/ledger/list', 'POST', params)
  return res
}

export const ledgerDelete = async (id: number) => {
  const res: any = await request(`/ledger/del/${id}`, 'DELETE')
  return res
}

export const ledgerAdd = async (params: any) => {
  const res: any = await request('/ledger/add', 'POST', params)
  return res
}

export const ledgerEdit = async (params: any) => {
  const res: any = await request('/ledger/edit', 'POST', params)
  return res
}

export const checkDatePrice = async (params: any) => {
  const res: any = await request('/ledger/checkDatePrice', 'GET', params)
  return res
}

export const ledgerCheckDatePrice = async (params: any) => {
  const res: any = await request('/ledger/checkDatePrice', 'GET', params)
  return res
}
