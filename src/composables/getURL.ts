/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-03-12 14:48:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-10-02 03:26:10
 * @FilePath: \wanWanUA\src\composables\getURL.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

export const getURL = () => {
  const BASE_URL =
    import.meta.env.MODE === 'development'
      ? 'http://127.0.0.1:3001' // 调试 app 需要固定的ip地址
      : 'http://192.168.0.106:3001'

  return { BASE_URL }

  // <script setup lang="ts">
  // ✅ 无需写 import { getURL } from '@/composables/getURL'
  // const { BASE_URL } = getURL()
  // </script>
}

export const getURLS = () => {
  const BASE_URLS =
    import.meta.env.MODE === 'development'
      ? ['http://127.0.0.1:3001'] // 调试 app 需要固定的ip地址
      : ['http://192.168.0.109:3001', 'http://192.168.0.106:3001']

  return { BASE_URL: BASE_URLS[0], BASE_URLS }
}
