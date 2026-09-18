<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-15 11:29:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-18 18:57:05
 * @FilePath: \wanWanUA\src\pages\chart\calendar.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <uni-calendar
    class="uni-calendar--hook"
    :selected="info.selected"
    :lunar="info.lunar"
    :range="info.range"
    :insert="info.insert"
    @change="change"
    @monthSwitch="monthSwitch"
    :endDate="maxDate"
  />
</template>

<script lang="ts" setup>
import { expensesDetailCheckDatePrice } from '@/api/expensesDetail'
import type { FormData, Info, SelectedItem } from '@/pages/chart/types'
import { useInfoStore } from '@/store/user'
import _utils from '@/utils/utils'
import { computed, onMounted, ref } from 'vue'

const userInfo = useInfoStore().user
const modelValue = defineModel<FormData>('modelValue', { default: {} })
const params = computed(() => modelValue.value)
const emits = defineEmits<{
  (e: 'update:modelValue', value: FormData): void
  (e: 'change', value: string): void
  (e: 'monthSwitch', value: string): void
}>()

const info = ref<Info>({
  lunar: false,
  range: false,
  insert: true,
  selected: [] as SelectedItem[]
})

const change = (e: any) => {
  console.log('change 返回:', e)
  emits('change', e.fulldate)
}

const monthSwitch = (e: any) => {
  console.log('monthSwitch 返回:', e)
  const month = `${e.year}-${e.month}`
  emits('monthSwitch', month)
  const { firstDay, lastDay } = _utils.getCurrentMonthRange(month)
  params.value.startDate = firstDay
  params.value.endDate = lastDay
  init()
}

// 当天日期 yyyy-mm-dd
const maxDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
})

const init = async () => {
  const res = await expensesDetailCheckDatePrice({ ...params.value, userId: userInfo.userId })
  info.value.selected = Object.entries(res.dayMap ?? {}).map(([key, value]: [string, any]) => ({
    date: key,
    info: `￥${value.total}`,
    data: {
      custom: String(value.total),
      name: key
    }
  }))
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped></style>
