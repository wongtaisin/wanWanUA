<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-20 23:50:27
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-24 23:45:50
 * @FilePath: \wanWanUA\src\pages\home\index.vue
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <view class="home-content">
    <view class="home-segmented">
      <uni-segmented-control
        :current="current"
        :values="items"
        style-type="button"
        active-color="#343233"
        @clickItem="onClickItem"
      />
    </view>

    <Expenses v-if="current === 0" />
    <Earn v-if="current === 1" />
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Earn from './earn.vue'
import Expenses from './expenses.vue'

const items = reactive(['消费', '收入 '])
const current = ref(0)

const onClickItem = (e: { currentIndex: number }) => {
  if (current.value !== e.currentIndex) {
    current.value = e.currentIndex
  }
}
</script>

<style lang="scss" scoped>
.home-segmented {
  background: #fede2b;
  padding: 0 40rpx;
  padding-bottom: 20rpx;
  position: sticky;

  /* #ifdef H5 */
  top: 76rpx;
  /* #endif */

  /* #ifdef APP */
  top: 0rpx;
  /* #endif */

  z-index: 2;
}
</style>
