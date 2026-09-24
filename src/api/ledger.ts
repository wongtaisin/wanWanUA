/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-24 02:18:52
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-25 01:59:13
 * @FilePath: \wanWanUA\src\api\ledger.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
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

export const ledgerNameCheckType = async (params?: any) => {
  const res: any = await request('/ledgerName/checkType', 'GET', params)
  return res
}
