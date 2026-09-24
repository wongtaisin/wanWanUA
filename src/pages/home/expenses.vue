<template>
  <view class="expenses-content">
    <!-- <uni-section title="请选择您的支出类型" type="line"/> -->
    <view class="grid-container">
      <uni-grid :column="4" :show-border="false">
        <uni-grid-item v-for="(item, i) in tableData" :key="i" @click="handleClick(item)">
          <view style="text-align: center; padding: 20rpx 0">
            /* #ifdef H5 */
            <svg class="icon">
              <use :xlink:href="`#${item.icon}`" />
            </svg>
            /* #endif */
            <text />
            /* #ifdef APP */
            <text :class="'iconfont ' + item.icon" />
            /* #endif */
            <text class="grid-text">{{ item.label }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <CommonPopup
      ref="commonPopupRef"
      v-model="params"
      :ledgerData="ledgerOptions"
      @submit="onSubmit"
    />
  </view>
</template>

<script lang="ts" setup>
import { ledgerNameCheckType } from '@/api/ledger'
import { request } from '@/api/request'
import _utils from '@/utils/utils'
import { ref } from 'vue'

interface FormData {
  type: string
  ledgerName: string
  money: string
  paymentId: number
  paymentName: string
  createDate: string
  [key: string]: string | number | Record<string, any>[] | undefined | null | any
}

// 表单数据初始值
const initialFormData: FormData = {
  type: '1',
  ledgerName: '',
  money: '',
  // shopName: '',
  paymentId: 2,
  paymentName: '微信',
  createDate: ''
}

const params = ref<FormData>({ ...initialFormData })
const commonPopupRef = ref()

const handleClick = (item: { label: string; icon: string }) => {
  commonPopupRef.value.open() // 打开弹窗
  params.value = { ...initialFormData }
  params.value.createDate = _utils.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
  params.value.ledgerName = item.label
}

const onSubmit = async (values: any) => {
  const mergedRow = { ...values, ...params.value }

  console.log(`新增消费`, mergedRow)

  await request('/ledger/add', 'POST', params.value)
    .then((_res: any) => {
      const tit = tableData.value.find((item: any) => item.label === values.ledgerName)?.label || ''
      uni.showToast({
        title: `${tit}花费：￥${values.money}`,
        icon: 'success'
      })
    })
    .catch((err: any) => {
      console.error('新增失败:', err)
    })
    .finally(() => {
      commonPopupRef.value.close()
    })
}

const tableData: any = ref([{ label: '新增', icon: 'icon-qitafeiyong' }])

const ledgerOptions = ref([])
const init = async () => {
  const { list } = await ledgerNameCheckType({ type: '1' })
  ledgerOptions.value = list.map((item: any) => item.name)
  tableData.value = list.map((item: any) => ({ label: item.name, icon: item.icon }))
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.expenses-content {
  width: 100vw;
  margin-top: 40rpx;

  /* #ifdef APP */
  padding-bottom: calc(env(safe-area-inset-bottom) - 40rpx);
  /* #endif */

  /* #ifdef H5 */
  padding-bottom: var(--window-bottom);
  /* #endif */

  .grid-text {
    font-size: 28rpx;
    color: #333;
    display: block;
    margin-top: 10rpx;
  }

  .popup-title {
    font-size: 34rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .icon {
    width: 80rpx;
    height: 80rpx;
    margin: 0 auto;
  }

  .iconfont {
    font-size: 55rpx;
  }
}
</style>
