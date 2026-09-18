/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-14 09:00:29
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-18 18:02:28
 * @FilePath: \wanWanUA\src\api\expenses.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { request } from '@/api/request'

export const expensesList = async (params: any) => {
  const res: any = await request('/expenses/list', 'POST', params)
  return res
}

export const expensesCheck = async (params: any) => {
  const res: any = await request('/expenses/check', 'POST', params)
  return res
}
