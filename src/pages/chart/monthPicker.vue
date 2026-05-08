<template>
  <view class="month-picker">
    <!-- 头部年份 -->
    <view class="header">
      <view class="arrow" @click="prevYear">«</view>
      <view class="year">{{ currentYear }}</view>
      <view class="arrow" :class="`${currentYear === year ? 'not' : ''}`" @click="nextYear">»</view>
    </view>

    <!-- 月份网格 -->
    <view class="months">
      <view
        v-for="(m, index) in monthList"
        :key="index"
        class="month-item"
        :class="{
          active: padMonth(m.label) === selectedMonth && currentYear === selectedYear
        }"
        @click="m.value !== 0 && handleMonth(m.label)"
      >
        {{ m.label }}
        <view class="month-text" v-if="m.value !== 0">￥{{ m.value }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { checkDatePrice } from '@/api/expensesDetail'
import { useInfoStore } from '@/store/user'
import { onMounted, ref } from 'vue'

interface Props {
  modelValue?: string // 格式：YYYY-MM
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const userInfo = useInfoStore().user
const emits = defineEmits(['update:modelValue', 'change', 'yearSwitch'])

// 当前年月
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1

const selectedYear = ref(props.modelValue ? Number(props.modelValue.split('-')[0]) : year)
const selectedMonth = ref(
  props.modelValue ? props.modelValue.split('-')[1] : String(month).padStart(2, '0')
)

// UI 当前年的显示
const currentYear = ref(selectedYear.value)

// 月份列表
const monthList = ref<{ value: number; label: string }[]>([
  { value: 1, label: '1月' },
  { value: 2, label: '2月' },
  { value: 3, label: '3月' },
  { value: 4, label: '4月' },
  { value: 5, label: '5月' },
  { value: 6, label: '6月' },
  { value: 7, label: '7月' },
  { value: 8, label: '8月' },
  { value: 9, label: '9月' },
  { value: 10, label: '10月' },
  { value: 11, label: '11月' },
  { value: 12, label: '12月' }
])

// 格式化月份，确保是两位数
const padMonth = (m: string) => {
  return String(Number(m.replace('月', ''))).padStart(2, '0')
}

// 切换年份
const prevYear = () => {
  currentYear.value--
  handleYear(currentYear.value)
}
const nextYear = () => {
  if (currentYear.value === year) {
    return
  }

  currentYear.value++
  handleYear(currentYear.value)
}

// 处理年份切换
const handleYear = (year: number) => {
  console.log('handleYear 返回:', year)
  selectedYear.value = year
  init()
  emits('yearSwitch', String(year))
}

// 选择月份
const handleMonth = (m: string) => {
  // 如果是当前年份，不能选择大于当前月份的月份
  // if (currentYear.value === year && Number(padMonth(m)) > month) {
  //   uni.showToast({
  //     title: `现在是${month}月份，不能选择未来月份`,
  //     icon: 'none'
  //   })
  //   return
  // }

  selectedYear.value = currentYear.value
  selectedMonth.value = padMonth(m)
  const val = `${currentYear.value}-${selectedMonth.value}`
  emits('change', val)
  emits('update:modelValue', val)
}

const init = async () => {
  const res = await checkDatePrice({
    userId: userInfo.userId,
    startDate: `${selectedYear.value}-01-01`,
    endDate: `${selectedYear.value}-12-31`
  })

  monthList.value.forEach((item: any) => {
    const key = `${selectedYear.value}-${padMonth(item.label)}`
    item.value = res.monthMap[key]?.total || 0
  })
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.month-picker {
  padding: 20rpx 0;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;
    font-size: 34rpx;
    padding-bottom: 20rpx;
    border-bottom: 1px solid #ededed;
  }

  .arrow {
    padding: 0 40rpx;
    font-size: 32rpx;
    color: #555;
  }

  .not {
    color: #c1c2c2;
  }

  .year {
    font-size: 36rpx;
  }

  .months {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 30rpx;
    column-gap: 0;
    text-align: center;
  }

  .month-item {
    padding: 20rpx 0;
    font-size: 30rpx;
    color: #666;
  }

  .month-item.active {
    color: #007aff;
    font-weight: bold;
  }

  .month-text {
    font-size: 24rpx;
    color: #e43d33;
    margin-top: 10rpx;
  }
}
</style>
