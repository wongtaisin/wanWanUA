<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 10:32:58
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-25 04:47:05
 * @FilePath: \wanWanUA\src\pages\chart\list.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <uni-section title="类型" type="line">
    <template v-slot:right>合计：{{ totals }}</template>
  </uni-section>

  <uni-list v-for="[item, value] in Object.entries(tableData)">
    <uni-list-item
      :title="classify[item].label"
      :note="`${value} 元 / ${totals} 元 = ${Number(
        ((Number(value) / Number(totals)) * 100).toFixed(2).replace(/\.?0+$/, '')
      )}%`"
      link
      @click="handleOpens(item)"
    >
      <template v-slot:header>
        /* #ifdef H5 */
        <svg class="slot-icon">
          <use :xlink:href="`#${classify[item].icon}`" />
        </svg>
        /* #endif */
        <text />
        /* #ifdef APP */
        <text :class="'iconfont ' + classify[item].icon" />
        /* #endif */
      </template>
      <!-- <template v-slot:body>
          <view class="slot-box">
            <view class="slot-text">
              <view>
                {{ classify[item].label }}
                {{ Number(((tableData[item] / totals) * 100).toFixed(2)) }}%
              </view>
              <view>
                {{ tableData[item] }}
              </view>
            </view>
            <CommonProgress
              style="margin-top: 20rpx"
              :percent="Number(((tableData[item] / totals) * 100).toFixed(2))"
              :height="12"
              active
            />
          </view>
        </template> -->
      <template v-slot:footer>
        <text class="slot-text">{{ tableData[item] }}</text>
      </template>
    </uni-list-item>
  </uni-list>
</template>

<script lang="ts" setup>
import type { FormData } from '@/pages/chart/types'
import { computed, ref, watch } from 'vue'

const data = defineModel<any>('data', { default: {} })
const modelValue = defineModel<FormData>('modelValue', { default: {} })
const params = computed(() => modelValue.value)
const tableData = ref<any>({})
const totals = ref(0)
const emits = defineEmits(['update:modelValue', 'change'])

const classify: any = {
  吃: { label: '吃', icon: 'icon-food-mifan' },
  喝: { label: '喝', icon: 'icon-kekoukele2' },
  玩: { label: '玩', icon: 'icon-a-GamePadyouxishoubing' },
  乐: { label: '乐', icon: 'icon-zhoubianyule' },
  过路费: { label: '过路费', icon: 'icon-guolufei' },
  油费: { label: '车油', icon: 'icon-jiayouzhan2' },
  停车费: { label: '停车费', icon: 'icon-tingchefeiyong' },
  交通费: { label: '交通费', icon: 'icon-gongjiaoche' },
  超市: { label: '超市', icon: 'icon-chaoshi2' },
  网购: { label: '网购', icon: 'icon-wanggou' },
  话费: { label: '话费', icon: 'icon-dianhua' },
  红包: { label: '红包', icon: 'icon-hongbao2' },
  vip: { label: 'vip', icon: 'icon-vip1' },
  其它: { label: '其它', icon: 'icon-qitafeiyong' },
  新澳: { label: '新澳', icon: '' }
}

const handleOpens = (item: string) => {
  emits('update:modelValue', { ...params.value, ledgerName: [item] })
  emits('change', { ...params.value, ledgerName: [item] })
}

const init = async () => {
  const { sum, total } = data.value
  tableData.value = { ...sum }
  totals.value = total
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

:deep(.uni-list--border-bottom) {
  height: 0;
}
</style>
