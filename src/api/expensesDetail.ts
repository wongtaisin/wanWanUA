/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 12:50:32
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-18 17:52:55
 * @FilePath: \wanWanUA\src\api\expensesDetail.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { request } from '@/api/request'

export const expensesDetailList = async (params: any) => {
  const res: any = await request('/expensesDetail/list', 'POST', params)
  return res
}

export const expensesDetailDelete = async (id: number) => {
  const res: any = await request(`/expensesDetail/del/${id}`, 'DELETE')
  return res
}

export const expensesDetailAdd = async (params: any) => {
  const res: any = await request('/expensesDetail/add', 'POST', params)
  return res
}

export const expensesDetailEdit = async (params: any) => {
  const res: any = await request('/expensesDetail/edit', 'POST', params)
  return res
}

export const checkDatePrice = async (params: any) => {
  const res: any = await request('/expensesDetail/checkDatePrice', 'GET', params)
  return res
}

export const expensesDetailCheckDatePrice = async (params: any) => {
  const res: any = await request('/expensesDetail/checkDatePrice', 'GET', params)
  return res
}
