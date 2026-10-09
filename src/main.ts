/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-11 16:36:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-30 15:11:58
 * @FilePath: \wanWanApp\src\main.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import { createSSRApp } from 'vue'
import App from './App.vue'
import './uni.scss'

// 导入工具函数
import Pinia from './store/index'
import install from './utils/index'

// 导入样式文件
// import './static/iconfont/iconfont.css'
// #ifdef APP-PLUS
import './static/iconfont/iconfont-color.css'
// #endif
// #ifdef H5
import './static/iconfont/iconfont.js'
// #endif

console.log('环境变量：', import.meta.env.MODE)

// #ifdef H5
if (import.meta.env.MODE === 'development') {
  import('vconsole').then(module => {
    new module.default()
  })
}
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia).use(install)

  return { app }
}
