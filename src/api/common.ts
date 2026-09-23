/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-10 11:02:33
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-26 09:08:07
 * @FilePath: \wanWanApp\src\api\common.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { request } from '@/api/request'

const areaData = async () => {
  const res: any = await request('/common/areaData', 'GET')
  return res
}

const commonList = async (params: any) => {
  const res: any = await request('/common/list', 'POST', params)
  return res
}

export { areaData, commonList }
