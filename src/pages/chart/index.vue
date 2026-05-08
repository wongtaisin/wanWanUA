<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 10:32:58
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-05-08 08:11:10
 * @FilePath: \wanWanUA\src\pages\chart\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <view class="chart-page">
    <view class="chart-segmented">
      <uni-segmented-control
        :current="current"
        :values="items"
        style-type="button"
        active-color="#343233"
        @clickItem="onClickItem"
      />
    </view>

    <Week
      v-if="current === 0"
      @click="
        (val: { start: string; end: string }) => {
          params.startDate = val.start
          params.endDate = val.end
        }
      "
    />

    <Calendar
      v-if="current === 1"
      ref="calendarRef"
      v-model="params"
      @month-switch="
        (val: string) => {
          // val: yyyy-MM 格式
          const { firstDay, lastDay } = _utils.getCurrentMonthRange(val)
          params.startDate = firstDay
          params.endDate = lastDay
        }
      "
      @change="
        (val: string) => {
          // val: yyyy-MM-dd 格式
          const op = {
            startDate: val,
            endDate: val,
            expensesName: expensesNames
          } as any
          handleOpens(op)
        }
      "
    />

    <!-- 年视图：截取前7位，如 2025-01-01 → 2025-01 -->
    <MonthPicker
      v-if="current === 2"
      ref="monthPickerRef"
      @year-switch="
        (val: string) => {
          // val: yyyy 格式
          params.startDate = `${val}-01-01`
          params.endDate = `${val}-12-31`
          // TODO 这是为了更新列表的时间范围，list 会获取参数变化而更新
        }
      "
      @change="
        (val: string) => {
          // val: yyyy-MM 格式
          const { lastDay } = _utils.getCurrentMonthRange(val)
          const op = {
            startDate: `${val}-01`,
            endDate: `${lastDay}`,
            expensesName: expensesNames
          }
          handleOpens(op)
        }
      "
    />

    <List
      ref="listRef"
      :model-value="params"
      @update:model-value="
        (val: { startDate: string; endDate: string; expensesName: string[] }) => {
          const { startDate, endDate } = val
          params.startDate = startDate
          params.endDate = endDate
          handleOpens(val)
        }
      "
    />

    <Spend ref="spendRef" />
  </view>
</template>

<script lang="ts" setup>
import Calendar from '@/pages/chart/calendar.vue'
import List from '@/pages/chart/list.vue'
import MonthPicker from '@/pages/chart/monthPicker.vue'
import Spend from '@/pages/chart/spend.vue'
import type { FormData } from '@/pages/chart/types'
import { expensesNames, getWeekRange } from '@/pages/chart/utils'
import Week from '@/pages/chart/week.vue'
import _utils from '@/utils/utils'
import { onMounted, reactive, ref } from 'vue'

interface ListForm {
  expensesName: string[]
}

interface SpendForm {
  startDate: string
  endDate: string
  expensesName: ListForm['expensesName']
}

const params = ref<FormData>({ startDate: '', endDate: '' })
const items = reactive(['周', '月', '年'])
const current = ref(0)
const spendRef = ref()

const handleOpens = (rows: SpendForm) => {
  spendRef.value.opens(rows)
}

const onClickItem = (e: { currentIndex: number }) => {
  if (current.value !== e.currentIndex) {
    current.value = e.currentIndex
  }

  switch (e.currentIndex) {
    case 0:
      const week = getWeekRange()
      params.value.startDate = week.weekStart
      params.value.endDate = week.weekEnd
      break
    case 1:
      const month = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
      const { firstDay, lastDay } = _utils.getCurrentMonthRange(month)
      params.value.startDate = firstDay
      params.value.endDate = lastDay
      break
    case 2:
      const year = new Date().getFullYear()
      params.value.startDate = `${year}-01-01`
      params.value.endDate = `${year}-12-31`
      break
  }
}

onMounted(() => {
  onClickItem({ currentIndex: 0 })
})
</script>

<style lang="scss" scoped>
.chart-page {
  .chart-segmented {
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

  .slot-icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
  }

  .slot-box {
    width: 100%;
  }

  .slot-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
  }
}
</style>
