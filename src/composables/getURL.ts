/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-03-12 14:48:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-11-01 00:37:12
 * @FilePath: \wanWanUA\src\composables\getURL.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

export const getURL = () => {
  const BASE_URL = (
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_DEV_BASE_URL
      : import.meta.env.VITE_PROD_BASE_URL
  ).replace(/\/+$/, '')

  return { BASE_URL }

  // <script setup lang="ts">
  // ✅ 无需写 import { getURL } from '@/composables/getURL'
  // const { BASE_URL } = getURL()
  // </script>
}

export const getURLS = () => {
  const BASE_URLS =
    import.meta.env.MODE === 'development'
      ? [import.meta.env.VITE_DEV_BASE_URL]
      : [import.meta.env.VITE_PROD_BASE_URL, import.meta.env.VITE_DEV_BASE_URL]

  return { BASE_URL: BASE_URLS[0], BASE_URLS }
}
