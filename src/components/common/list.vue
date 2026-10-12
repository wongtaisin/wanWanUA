<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-10-13 00:03:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-10-13 01:44:56
 * @FilePath: \wanWanUA\src\components\common\list.vue
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <uni-list-item>
    <template v-slot:header v-if="item.image">
      <!-- todo 图片 本地地址需要读取，不然值得获取 /api -->
      <image
        lazy-load
        mode="heightFix"
        :src="`${BASE_URL}${item.image}`"
        @click="previewSingleImage(`${BASE_URL}${item.image}`)"
        style="height: 86rpx; margin-right: 20rpx"
      />
    </template>
    <template v-slot:body v-else>
      <view class="list-body">
        <view class="shop-name">{{ item.shop_name }} </view>
        <rich-text class="remark-text" :nodes="item.remark" />
        <view class="create-date"> {{ item.create_date }} </view>
      </view>
    </template>
    <template v-slot:footer>
      <view class="list-footer">
        <text v-if="item.type === '1'">-{{ item.money }}</text>
        <text v-else style="color: #e43d33">+{{ item.money }}</text>
      </view>
    </template>
  </uni-list-item>
</template>

<script lang="ts" setup>
interface Props {
  item: any
}

const props = withDefaults(defineProps<Props>(), {
  item: {}
})

const { BASE_URL } = getURL()

const previewSingleImage = (image: string) => {
  uni.previewImage({
    current: image,
    urls: [image],
    indicator: 'default',
    loop: false
  })
}
</script>

<style lang="scss" scoped>
.list-body {
  width: 650rpx;

  .shop-name {
    font-size: 26rpx;
    color: #666565;
    margin-bottom: 10rpx;
  }

  .remark-text {
    font-size: 28rpx;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .create-date {
    font-size: 24rpx;
    color: #999999;
    margin-top: 10rpx;
  }
}

.list-footer {
  display: flex;
  align-items: center;

  text {
    width: 100rpx;
    text-align: right;
  }
}
</style>
