<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 10:32:58
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-10-26 00:21:08
 * @FilePath: \wanWanUA\src\pages\chart\list.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <uni-section title="类型" type="line">
    <template v-slot:right
      >合计：{{ ledger.incomeTotal }} - {{ ledger.expenseTotal }} = {{ ledger.total }}</template
    >
  </uni-section>

  <uni-list>
    <uni-list-item
      v-for="[item, value] in sortedTableData"
      :key="item"
      :title="classify[item]?.label ?? item"
      :note="`收入：${value.income}；支出：${value.expense}`"
      link
      @click="handleOpens(item)"
    >
      <template v-slot:header>
        /* #ifdef H5 */
        <svg v-if="classify[item]?.icon" class="slot-icon">
          <use :xlink:href="`#${classify[item].icon}`" />
        </svg>
        /* #endif */
        <text />
        /* #ifdef APP */
        <text v-if="classify[item]?.icon" :class="'iconfont ' + classify[item].icon" />
        /* #endif */
      </template>
      <template v-slot:footer>
        <text class="slot-text" :class="{ positive: !/-/.test(String(value.total)) }">
          {{ value.total }}
        </text>
      </template>
    </uni-list-item>
  </uni-list>
</template>

<script lang="ts" setup>
import type { FormData } from '@/pages/chart/types'
import { computed, defineEmits, defineModel, ref, watch } from 'vue'

interface LedgerType {
  name: string
  icon?: string
}

const data = defineModel<any>('data', { default: {} })
const list = defineModel<LedgerType[]>('list', { default: () => [] })
const modelValue = defineModel<FormData>('modelValue', { default: {} })
const params = computed(() => modelValue.value)
const tableData = ref<any>({})
const ledger = ref<any>({})
const emits = defineEmits(['update:modelValue', 'change'])

const isExpense = (value: unknown) => /-/.test(String(value))

const sortedTableData = computed(() => {
  const entries = Object.entries(
    tableData.value as Record<string, { total?: number; income?: number; expense?: number }>
  )
  const sortByTotal = (expense: boolean) =>
    entries
      .filter(([, value]) => isExpense(value.total) === expense)
      .sort(([, valueA], [, valueB]) => {
        const totalA = Number(valueA.total)
        const totalB = Number(valueB.total)
        return (
          (Number.isFinite(totalB) ? Math.abs(totalB) : 0) -
          (Number.isFinite(totalA) ? Math.abs(totalA) : 0)
        )
      })

  return [...sortByTotal(true), ...sortByTotal(false)]
})

/**
 * @abstract 类型分类
 * @returns 吃: { label: '吃', icon: 'icon-food-mifan' },
 * */
const classify = computed<Record<string, { label: string; icon?: string }>>(() =>
  Object.fromEntries(list.value.map(({ name, icon }) => [name, { label: name, icon }]))
)

const handleOpens = (item: string) => {
  emits('update:modelValue', { ...params.value, ledgerName: [item] })
  emits('change', { ...params.value, ledgerName: [item] })
}

const init = async () => {
  const { sum, total, expenseTotal, incomeTotal } = data.value
  tableData.value = { ...sum }
  ledger.value = {
    expenseTotal,
    incomeTotal,
    total
  }
}

watch(
  () => {
    data.value
  },
  () => {
    init()
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.slot-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}

.iconfont {
  font-size: 60rpx;
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

.slot-text.positive {
  color: #e43d33;
}

:deep(.uni-list--border-bottom) {
  height: 0;
}
</style>
