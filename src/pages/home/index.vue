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
    <Income v-if="current === 1" />
  </view>
</template>

<script lang="ts" setup>
import Income from '@/pages/earn/index.vue'
import Expenses from '@/pages/expenses/index.vue'
import { reactive, ref } from 'vue'

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
