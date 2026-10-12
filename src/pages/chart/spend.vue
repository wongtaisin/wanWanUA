<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-06 14:35:26
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-10-13 01:26:11
 * @FilePath: \wanWanUA\src\pages\chart\spend.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <uni-popup ref="popupRef" :safe-area="true" type="right" background-color="#fff">
    <scroll-view scroll-y style="height: calc(100vh - 1rpx)" @scrolltolower="loadMore">
      <view class="popup-content">
        <uni-list v-for="item in tableData" :key="item.date">
          <!-- <uni-tooltip :content="item.remark" placement="bottom"> -->
          <CommonList :item="item" />
          <!-- </uni-tooltip> -->
        </uni-list>

        <!-- 加载提示 -->
        <uni-load-more :status="status" />
      </view>
    </scroll-view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ledgerList } from '@/api/ledger'
import { defineExpose, ref } from 'vue'

interface FormData {
  ledgerName: string[]
  [key: string]: any
}

// 表单数据初始值
const initialFormData: FormData = {
  ledgerName: [],
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 15
}
const tableData = ref<any>([])
const params = ref(initialFormData)
const status = ref('more') // more/loading/noMore
const popupRef = ref()

const open = (rows: any) => {
  params.value = { ...initialFormData, ...rows }
  tableData.value = []
  init()
  popupRef.value.open()
}

const init = async () => {
  status.value = 'loading'
  const { list, total }: any = await ledgerList(params.value)
  tableData.value = [...tableData.value, ...list]
  const totalPage = Math.ceil(total / params.value.pageSize) // 计算总页数
  status.value = params.value.page >= totalPage ? 'noMore' : 'more'
}

const loadMore = () => {
  if (status.value !== 'more') return
  params.value.page++
  init()
}

defineExpose({
  opens: (rows: any) => open(rows),
  close: () => popupRef.value.close()
})
</script>

<style lang="scss" scoped>
.popup-content {
  max-width: 600rpx;
  min-width: 375rpx;
}

:deep(.uni-list--border-bottom) {
  height: 0;
}
</style>
