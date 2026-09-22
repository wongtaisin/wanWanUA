<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-13 16:12:04
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-27 11:11:32
 * @FilePath: \wanWanApp\src\pages\login\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <view class="login-page">
    <uni-forms ref="formRef" :model="params" :rules="rules">
      <uni-forms-item label="用户名" name="user_name" :required="true">
        <uni-easyinput v-model="params.user_name" placeholder="请输入用户名" />
      </uni-forms-item>
      <uni-forms-item label="密码" name="password" :required="true">
        <uni-easyinput v-model="params.password" type="password" placeholder="请输入密码" />
      </uni-forms-item>
      <button type="primary" size="large" @click="onSubmit">提交</button>
    </uni-forms>
  </view>
</template>

<script lang="ts" setup>
import { login } from '@/api/user'
import { useInfoStore } from '@/store/user'
import { reactive, ref } from 'vue'

const params = reactive({
  user_name: '',
  password: ''
})
const formRef = ref()
const rules = {
  user_name: { rules: [{ required: true, errorMessage: '用户名不能为空' }] },
  password: { rules: [{ required: true, errorMessage: '密码不能为空' }] }
}
const userInfo = useInfoStore()

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async (res: any) => {
      const { token }: any = await login(res)
      uni.setStorageSync('token', token) // 登录成功后，将token存储到本地
      const data = await userInfo.getUserInfo() // 登录成功后，获取用户信息
      userInfo.setUserInfo(data) // 登录成功后，设置用户信息
      uni.showToast({ title: '登录成功', icon: 'success' })
      uni.switchTab({ url: '/pages/home/index' })
    })
    .catch((err: any) => {
      console.error('err', err)
      uni.showToast({ title: `${err[0].errorMessage}` })
    })
}
</script>

<style scoped lang="scss">
.login-page {
  padding: 40rpx;
}
</style>
