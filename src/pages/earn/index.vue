<template>
  <view class="earn-content">
    <!-- <uni-section title="请选择您的收入类型" type="line"/> -->
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
            <text class="grid-text">{{ item.text }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <EarnPopup ref="earnPopupRef" v-model="params" @submit="onSubmit" />
  </view>
</template>

<script lang="ts" setup>
import { request } from '@/api/request'
import _utils from '@/utils/utils'
import { ref } from 'vue'
import EarnPopup from './earnPopup.vue'

interface FormData {
  earnName: string
  money: string
  paymentId: number
  paymentName: string
  createDate: string
  [key: string]: string | number | Record<string, any>[] | undefined | null | any
}

// 表单数据初始值
const initialFormData: FormData = {
  earnName: '',
  money: '',
  paymentId: 2,
  paymentName: '微信',
  createDate: ''
}

const params = ref<FormData>({ ...initialFormData })
const earnPopupRef = ref()

const handleClick = (item: { text: string; icon: string }) => {
  earnPopupRef.value.open() // 打开弹窗
  params.value = { ...initialFormData }
  params.value.createDate = _utils.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
  params.value.earnName = item.text
  console.log(`新增收入`, params.value, item)
}

const onSubmit = async (values: any) => {
  const mergedRow = { ...values, ...params.value }

  console.log(`新增收入`, mergedRow)

  await request('/earn/add', 'POST', params.value)
    .then((_res: any) => {
      const tit = tableData.value.find((item: any) => item.text === values.name)?.text || ''
      uni.showToast({
        title: `${tit}收入：￥${values.money}`,
        icon: 'success'
      })
    })
    .catch((err: any) => {
      console.error('新增失败:', err)
    })
    .finally(() => {
      earnPopupRef.value.close()
    })
}

const tableData = ref([
  { text: '新澳', icon: 'icon-food-mifan' },
  { text: '世界杯', icon: 'icon-kekoukele2' }
])
</script>

<style lang="scss" scoped>
.earn-content {
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
