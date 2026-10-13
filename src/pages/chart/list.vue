<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 10:32:58
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-10-14 00:00:12
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

const data = defineModel<any>('data', { default: {} })
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

const classify: any = {
  吃: { label: '吃', icon: 'icon-food-mifan' },
  喝: { label: '喝', icon: 'icon-kekoukele2' },
  玩: { label: '玩', icon: 'icon-a-GamePadyouxishoubing' },
  乐: { label: '乐', icon: 'icon-zhoubianyule' },
  过路费: { label: '过路费', icon: 'icon-guolufei' },
  车油: { label: '车油', icon: 'icon-jiayouzhan2' },
  停车费: { label: '停车费', icon: 'icon-tingchefeiyong' },
  交通费: { label: '交通费', icon: 'icon-gongjiaoche' },
  超市: { label: '超市', icon: 'icon-chaoshi2' },
  网购: { label: '网购', icon: 'icon-wanggou' },
  话费: { label: '话费', icon: 'icon-dianhua' },
  红包: { label: '红包', icon: 'icon-hongbao2' },
  vip: { label: 'vip', icon: 'icon-vip1' },
  其它: { label: '其它', icon: 'icon-qitafeiyong' },
  新澳: { label: '新澳', icon: 'icon-liuhecai' },
  工资: { label: '工资', icon: 'icon-gongzi' },
  兼职: { label: '兼职', icon: 'icon-fuyejianzhi' },
  借钱: { label: '借钱', icon: 'icon-jieqian' },
  还钱: { label: '还钱', icon: 'icon-huanqian' }
}

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
