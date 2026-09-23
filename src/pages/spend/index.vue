<!--
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-01 10:32:58
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-23 23:44:42
 * @FilePath: \wanWanUA\src\pages\spend\index.vue
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
-->
<template>
  <view class="spend-page">
    <uni-row class="top">
      <uni-col :span="8">
        <text class="text">{{ month.slice(0, 4) }}年</text>
        <MothPicker v-model="month" @change="handleChange">
          <p class="money">
            {{ month.slice(5, 7) }}
            <text style="font-size: 28rpx">月</text>
          </p>
        </MothPicker>
      </uni-col>
      <uni-col :span="8">
        <text class="text">消费笔数</text>
        <p class="money">{{ params.total }}</p>
      </uni-col>
      <uni-col :span="8">
        <text class="text">消费</text>
        <p class="money">{{ (Number(moneyTotal) - Number(earnTotal)).toFixed(2) }}</p>
      </uni-col>
      <!-- <uni-col :span="8">
        <text class="text">详情</text>
        <p class="money">{{ moneyTotal }} - {{ earnTotal }}</p>
      </uni-col> -->
    </uni-row>

    <scroll-view
      class="list-scroll"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresh"
    >
      <uni-list v-for="group in tableData" :key="group.date">
        <view class="list-top">
          <uni-row>
            <uni-col :span="12">
              <uni-icons type="calendar" size="20" style="color: #409eff; margin-right: 10rpx" />
              <text>
                {{ group.date }}
              </text>
            </uni-col>
            <uni-col :span="12" style="text-align: right">
              <text>合计：{{ group.total.toFixed(2) }}</text>
            </uni-col>
          </uni-row>
        </view>

        <uni-swipe-action ref="swipeActionRef">
          <!-- 右侧带角标 -->
          <uni-swipe-action-item
            v-for="(item, i) in group.list"
            :key="item.id"
            :right-options="options"
            @click="handleClick($event, item, i)"
            @change="swipeChange($event, item, i)"
          >
            <uni-list-item :title="item.shop_name || item.remark" :note="item.create_date">
              <template v-slot:header v-if="item.image">
                <!-- 图片 本地地址需要读取，不然值得获取 /api -->

                <image
                  lazy-load
                  mode="heightFix"
                  :src="`${BASE_URL}${item.image}`"
                  @click="previewSingleImage(`${BASE_URL}${item.image}`)"
                  style="height: 86rpx; margin-right: 20rpx"
                />
              </template>
              <template v-slot:body v-else>
                <view class="body-content">
                  <view>
                    <!-- <svg class="slot-icon">
                      <use xlink:href="#icon-dianpu1" />
                    </svg> -->
                    {{ item.shop_name }}
                  </view>
                  <view> {{ item.remark }} </view>
                  <view> {{ item.create_date }} </view>
                </view>
              </template>
              <template v-slot:footer>
                <view class="chat-custom-right">
                  <text v-if="item.type === '1'" style="color: #dd524d">-{{ item.money }}</text>
                  <text v-else style="color: #67c23a">+{{ item.money }}</text>
                </view>
              </template>
            </uni-list-item>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </uni-list>

      <!-- 加载提示 -->
      <uni-load-more :status="status" />
    </scroll-view>
  </view>

  <ExpensesPopup title="编辑" ref="expensesPopupRef" v-model="expensesParams" @submit="onSubmit" />
</template>

<script lang="ts" setup>
import { commonList } from '@/api/common'
import { earnCheckDatePrice } from '@/api/earn'
import {
  expensesDetailCheckDatePrice,
  expensesDetailDelete,
  expensesDetailEdit
} from '@/api/expensesDetail'
import { useInfoStore } from '@/store/user'
import _utils from '@/utils/utils'
import { onMounted, reactive, ref } from 'vue'

const { BASE_URL } = getURL()

const userInfo = useInfoStore().user

type SpendGroup = { date: string; list: any[]; total: number }

const options = reactive([
  {
    text: '删除',
    style: {
      backgroundColor: '#dd524d'
    }
  },
  {
    text: '修改',
    style: {
      backgroundColor: '#007aff'
    }
  }
])

const month = ref(`${new Date().getFullYear()}-${new Date().getMonth() + 1}`)
const tableData = ref<SpendGroup[]>([])
const params = ref({
  startDate: _utils.getCurrentMonthRange(month.value).firstDay,
  endDate: _utils.getCurrentMonthRange(month.value).lastDay,
  page: 1,
  pageSize: 15,
  total: 0 // 传了后台也不接受，只用作显示消费笔数
})
const status = ref('more') // more/loading/noMore
const earnTotal = ref(0)
const moneyTotal = ref(0)
const expensesPopupRef = ref()
const expensesParams = ref<any>({})
const swipeActionRef = ref<any[]>([] as any[])
const editingMeta = ref<{ groupIndex: number; itemIndex: number } | null>(null)
const triggered = ref(false) // 是否在刷新中

const init = async () => {
  await Promise.all([initList(), initTotal(), initEarnTotal()])
}

// 初始化数据
const initList = async () => {
  status.value = 'loading'
  const { list, total }: any = await commonList(params.value)
  params.value.total = total

  // 重新设计list，需要把每一天的支出都展示出来，转成[{list:{}, date:2025-01-01, total:0}]
  const grouped = Object.values(
    list.reduce((acc: Record<string, any>, item: any) => {
      const date = item.create_date.split(' ')[0] // 只取年月日
      if (!acc[date]) {
        // 如果该日期不存在，则创建一个新对象
        acc[date] = { date, list: [], total: 0 } // 初始化该日期的对象
      }
      acc[date].list.push(item) // 把当前项添加到该日期的列表中

      const money = parseFloat(item.money) || 0
      if (item.type === '1') {
        acc[date].total -= money // 支出增加当日总额
      } else if (item.type === '2') {
        acc[date].total += money // 收入减少当日总额
      }

      return acc
    }, {})
  ) as SpendGroup[]

  tableData.value = [...tableData.value, ...grouped] // 合并数据
  const totalPage = Math.ceil(total / params.value.pageSize) // 计算总页数
  status.value = params.value.page >= totalPage ? 'noMore' : 'more'
}

// 支出总金额
const initTotal = async () => {
  const { startDate, endDate } = params.value
  const { total }: any = await expensesDetailCheckDatePrice({
    startDate,
    endDate,
    userId: userInfo.userId
  })
  moneyTotal.value = total || 0
}

const initEarnTotal = async () => {
  const { startDate, endDate } = params.value

  const { total }: any = await earnCheckDatePrice({
    startDate,
    endDate
  })

  earnTotal.value = total
}

const handleChange = (e: any) => {
  month.value = e // 可设置可不设置，因为组件里使用了双向绑定
  const { firstDay, lastDay } = _utils.getCurrentMonthRange(month.value)
  params.value.startDate = firstDay
  params.value.endDate = lastDay
  tableData.value = []
  params.value.page = 1
  init()
}

const handleClick = async (e: any, row: any, i: number) => {
  if (e.content.text === '修改') {
    expensesParams.value = _utils.toCamelCase(row)

    // 使用 setTimeout 延迟打开弹窗，避免事件冒泡导致立即关闭
    setTimeout(() => {
      expensesPopupRef.value.open()
    }, 100)
  } else {
    await expensesDetailDelete(row.id)
    tableData.value.splice(i, 1)
    uni.showToast({ title: '删除成功', icon: 'success' })
  }
}

const swipeChange = (e: any, row: any, index: number) => {
  const groupIndex = tableData.value.findIndex(
    (item: any) => item.date === row.create_date.slice(0, 10)
  )
  if (groupIndex > -1) {
    editingMeta.value = { groupIndex, itemIndex: index }
  }
  console.log(e, editingMeta.value)
}

const loadMore = () => {
  if (status.value !== 'more') return
  params.value.page++
  initList()
}

const onRefresh = async () => {
  triggered.value = true

  params.value.page = 1
  tableData.value = []

  await initList()
  await initTotal()

  triggered.value = false // 关闭刷新动画
}

const previewSingleImage = (image: string) => {
  uni.previewImage({
    current: image,
    urls: [image],
    indicator: 'default',
    loop: false
  })
}

const onSubmit = async (values: any) => {
  const mergedRow = { ...values, ...expensesParams.value }

  // _utils.removeEmptyKeys(mergedRow) // 清理空字符串键值对

  console.log(`编辑消费`, mergedRow)

  try {
    await expensesDetailEdit(mergedRow)
    syncEditedRow(_utils.toSnakeCase(mergedRow))
    uni.showToast({ title: `编辑成功`, icon: 'success' })
    const refs: any = swipeActionRef.value
    // 优化：兼容 ref="swipeActionRef" 可能为数组或单个实例，统一关闭所有 swipeAction 实例
    if (Array.isArray(refs)) {
      refs.forEach(inst => inst?.closeAll?.())
    } else {
      refs?.closeAll?.()
    }
  } catch {
    console.error(`报错`)
  } finally {
    expensesPopupRef.value.close()
  }
}

/**
 * @desc 同步编辑后的行数据到表格中, 并更新分组数据和总金额
 * @param {Record<string, any>} updatedRow - 包含更新后的行数据的对象
 * @returns {void}
 *
 * @example
 * @demo syncEditedRow({ money: '100', name: '新名称' })
 * @explain 会更新所有的数据，包括分组数据和总金额
    1、假设编辑的是第2组第3行数据，更新后的行数据为：{ money: '100', name: '新名称' }
    2、假设源分组为：{ date: '2025-01-02', list: [...], total: 1000 }
    3、假设源行数据为：{ id: 123, money: '50', name: '旧名称', create_date: '2025-01-02 10:00:00' }
    4、合并后的行数据为：{ id: 123, money: '100', name: '新名称', create_date: '2025-01-02 10:00:00' }
    5、假设旧金额为50，新金额为100，旧日期为2025-01-02，新日期仍为2025-01-02
    6、则更新后的分组为：{ date: '2025-01-02', list: [...], total: 1050 }
    7、则更新后的总金额为：1050
  *
 */
const syncEditedRow = (updatedRow: Record<string, any>) => {
  if (!editingMeta.value) return
  const { groupIndex, itemIndex } = editingMeta.value
  const sourceGroup = tableData.value[groupIndex] // 源分组
  if (!sourceGroup) return
  const originalRow = sourceGroup.list[itemIndex] // 源行数据
  if (!originalRow) return

  const mergedRow = { ...originalRow, ...updatedRow }
  const oldMoney = Number(originalRow.money) || 0
  const newMoney = Number(mergedRow.money) || 0
  const getSignedMoney = (row: Record<string, any>, money: number) =>
    String(row.type) === '1' ? -money : String(row.type) === '2' ? money : 0
  const oldSignedMoney = getSignedMoney(originalRow, oldMoney)
  const newSignedMoney = getSignedMoney(mergedRow, newMoney)
  const oldDate = (originalRow.create_date || sourceGroup.date)?.slice(0, 10)
  const newDate = (mergedRow.create_date || oldDate)?.slice(0, 10)

  /**
   * @desc 更新分组的总金额
   * @param {any} group 分组数据
   * @param {number} delta 金额增量
   * @returns {string} 更新后的金额
   */
  const updateGroupTotal = (group: any, delta: number) => {
    group.total = +(Number(group.total || 0) + delta).toFixed(2)
  }

  // 如果只改内容不改单日期
  if (oldDate === newDate) {
    sourceGroup.list[itemIndex] = mergedRow
    updateGroupTotal(sourceGroup, newSignedMoney - oldSignedMoney)
  } else {
    // 日期发生变化，需移动到新分组
    sourceGroup.list.splice(itemIndex, 1)
    updateGroupTotal(sourceGroup, -oldSignedMoney)
    // 如果原组已空则删除组
    if (sourceGroup.list.length === 0) {
      tableData.value.splice(groupIndex, 1)
    }

    // 查找目标组
    let targetGroup = tableData.value.find((g: any) => g.date === newDate)
    if (!targetGroup) {
      targetGroup = { date: newDate, list: [], total: 0 }
      tableData.value.push(targetGroup)
      // 重新排序，日期降序（新日期在前）
      tableData.value.sort((a: any, b: any) => (a.date < b.date ? 1 : -1))
    }

    // 插入数据（插入到list头部）
    targetGroup.list.unshift(mergedRow)
    updateGroupTotal(targetGroup, newSignedMoney)
  }

  // 总金额同步
  // 使用数值兜底，避免接口返回空值或字符串时总金额变成 NaN
  const currentTotal = Number(moneyTotal.value) || 0
  moneyTotal.value = +(currentTotal - oldSignedMoney + newSignedMoney).toFixed(2)
  editingMeta.value = null
  // 通知响应式系统
  tableData.value = tableData.value.slice()
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.spend-page {
  height: calc(100vh - 108px);

  .list-scroll {
    /* #ifdef H5 */
    height: calc(100vh - 190px);
    /* #endif */

    /* #ifdef APP */
    height: 100%;
    /* #endif */
  }

  .top {
    padding: 20rpx;
    background: #fede2b;
    position: sticky;

    /* #ifdef H5 */
    top: 76rpx;
    /* #endif */

    z-index: 2;

    .text {
      color: #7c7b7b;
    }

    .money {
      margin-top: 20rpx;
      font-size: 46rpx;
    }
  }

  .list-top {
    padding: 0 30rpx;
    line-height: 68rpx;
    color: #a0a0a0;
  }

  .body-content {
    width: 650rpx;

    .slot-icon {
      width: 14px;
      height: 14px;
      margin-right: 5rpx;
    }
    view {
      &:first-child {
        font-size: 14px;
        color: #3b4144;
        margin-bottom: 10rpx;
      }
      &:nth-child(2) {
        font-size: 28rpx;
        margin-bottom: 10rpx;
      }
      &:last-child {
        font-size: 12px;
        color: #999999;
      }
    }
  }

  .chat-custom-right {
    display: flex;
    align-items: center;

    text {
      width: 100rpx;
      text-align: right;
    }
  }
}

:deep(.uni-list--border-top) {
  height: 0;
}
</style>
