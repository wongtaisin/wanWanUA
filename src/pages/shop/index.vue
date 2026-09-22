<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-10 16:07:15
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-31 10:50:35
 * @FilePath: \wanWanApp\src\pages\shop\index.vue
 * @Description: 店铺列表
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <scroll-view
    scroll-y
    style="height: calc(100vh - 22rpx)"
    @scrolltolower="loadMore"
    refresher-enabled
    :refresher-triggered="triggered"
    @refresherrefresh="onRefresh"
  >
    <uni-list>
      <uni-swipe-action ref="swipeActionRef">
        <!-- 右侧带角标 -->
        <uni-swipe-action-item
          v-for="(item, i) in tableData"
          :key="item.id"
          :right-options="[
            { text: '删除', style: { backgroundColor: '#dd524d' } },
            { text: '修改', style: { backgroundColor: '#007aff' } }
          ]"
          @click="handleClick($event, item, i)"
          @change="swipeChange($event, i)"
        >
          <uni-list-item
            :title="item.shop_name"
            :note="[item.province, item.city, item.area, item.address].filter(Boolean).join('')"
          >
            <template v-slot:header v-if="item.images">
              <image
                lazy-load
                mode="heightFix"
                :src="`${BASE_URL}${item.images}`"
                style="height: 86rpx; margin-right: 20rpx"
              />
            </template>
          </uni-list-item>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </uni-list>
    <!-- 加载提示 -->
    <uni-load-more :status="status" />
  </scroll-view>

  <uni-fab
    :pattern="{
      color: '#7A7E83',
      backgroundColor: '#fff',
      selectedColor: '#007AFF',
      buttonColor: '#007AFF',
      iconColor: '#fff'
    }"
    :content="[
      {
        iconPath: '/static/image/icon/icon_home.png',
        selectedIconPath: '/static/image/icon/icon_home_HL.png',
        text: '首页',
        active: false
      },
      {
        iconPath: '/static/image/icon/icon_shop.png',
        selectedIconPath: '/static/image/icon/icon_shop_HL.png',
        text: '新增',
        active: false
      }
    ]"
    horizontal="right"
    vertical="bottom"
    direction="horizontal"
    @trigger="handleTrigger"
  />

  <Edit title="编辑地址" ref="editRef" @refresh="handleRefresh" />
</template>

<script lang="ts" setup>
import { shopDelete, shopList } from '@/api/shop'
import { onMounted, ref } from 'vue'
import Edit from './edit.vue'

const { BASE_URL } = getURL()

const status = ref('more') // more/loading/noMore
const params = ref({
  page: 1,
  pageSize: 15
})
const tableData = ref<any>([])
const swipeActionRef = ref()
const editRef = ref<any>()
const triggered = ref(false) // 是否在刷新中

const handleClick = async (e: any, row: any, i: number | string) => {
  if (e.content.text === '修改') {
    editRef.value.opens(row)
  } else {
    await shopDelete(row.id)
    tableData.value.splice(i, 1)
    uni.showToast({ title: '删除成功', icon: 'success' })
  }
}

const swipeChange = (e: any, index: number | string) => {
  console.log(e, index)
}

const loadMore = () => {
  if (status.value !== 'more') return
  params.value.page++
  init()
}

const handleTrigger = ({ item, index }: { item: any; index: number }) => {
  switch (index) {
    case 0:
      uni.switchTab({ url: '/pages/home/index' })
      break
    case 1:
      uni.navigateTo({ url: '/pages/shop/add' })
      break
  }
}

const handleRefresh = () => {
  params.value.page = 1
  tableData.value = []
  init()
}

const onRefresh = async () => {
  triggered.value = true

  params.value.page = 1
  tableData.value = []

  await init()

  triggered.value = false // 关闭刷新动画
}

const init = async () => {
  status.value = 'loading'
  const { list, total } = await shopList(params.value)
  tableData.value = [...tableData.value, ...list]
  status.value = tableData.value.length >= total ? 'noMore' : 'more'
}

onMounted(init)
</script>

<style lang="scss" scoped>
.shop-page {
  height: 100vh;
}
</style>
