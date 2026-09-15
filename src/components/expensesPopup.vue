<template>
  <uni-popup ref="popupRef" type="bottom" background-color="#fff" borderRadius="20rpx 20rpx 0 0">
    <view style="padding: 30rpx">
      <view class="popup-title">{{ props.title }}</view>
      <CommonForms
        ref="commonFormRef"
        label-align="right"
        label-width="22%"
        :rules="rules"
        :columns="formColumns"
        v-model="params"
        @submit="onSubmit"
      >
        <!-- 暂时使用 -->
        <uni-forms-item label="支出类型" name="expensesName" required>
          <uni-data-select
            placeholder="请选择支出类型"
            v-model="params.expensesName"
            :localdata="expenseTypes"
            @change="(val: string) => handleChange(expenseTypes, val, 'expensesText')"
          />
        </uni-forms-item>
        <uni-forms-item label="支付类型" name="paymentId" required>
          <uni-data-select
            placeholder="请选择支付类型"
            v-model="params.paymentId"
            :localdata="paymentRange"
            @change="(val: number) => handleChange(paymentRange, val, 'paymentName')"
          />
        </uni-forms-item>

        <uni-forms-item label="店铺" name="shopName">
          <uni-easyinput
            v-model="params.shopName"
            placeholder="点击选择店铺"
            @focus="handleShopSelect"
            @clear="handleShopClear"
          />
        </uni-forms-item>

        <uni-forms-item label="图片" name="image">
          <AutoUploadFile
            limit="1"
            :fileList="fileList"
            file-mediatype="image"
            :data="{ module: 'expenses' }"
            upload-url="/api/file/base/upload"
            @success="handleUploadSuccess"
          />
        </uni-forms-item>

        <uni-forms-item label="备注" name="remark">
          <uni-easyinput type="textarea" v-model="params.remark" placeholder="请输入备注" />
        </uni-forms-item>

        <uni-forms-item label="创建时间" name="createDate" required>
          <uni-datetime-picker
            :disabled="props.title !== '新增'"
            type="datetime"
            return-type="string"
            v-model="params.createDate"
            :end="maxDate"
          />
        </uni-forms-item>
      </CommonForms>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { paymentAll } from '@/api/payment'
import { useShop } from '@/store/common'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '新增'
})

interface FormData {
  expensesName: string
  expensesText: string
  money: string
  paymentId: number
  paymentName: string
  createDate: string
  [key: string]: string | number | Record<string, any>[] | undefined | null | any
}

const { BASE_URL } = getURL()
const userShop = useShop()
const modelValue = defineModel<FormData>('modelValue', { default: {} })
const params = computed(() => modelValue.value)
const popupRef = ref()
const fileList = computed(() =>
  params.value.image
    ? [
        {
          name: params.value.id,
          extname: 'image',
          url: `${BASE_URL}${params.value.image}`
        }
      ]
    : undefined
)
const emits = defineEmits(['submit'])

// 存储上传成功后的图片URL
const handleUploadSuccess = (file: any) => {
  const { url } = file.data
  params.value.image = url
  console.log('上传成功，图片URL:', file.data, params.value.image)
}

const onSubmit = async (values: any) => {
  emits('submit', values)
}

/**
 * @description 下拉选择
 * @param {any[]} list
 * @param {number} val // 下拉选择的值
 * @param {string} name
 */
const handleChange = (list: any[], val: number | string, name: string) => {
  console.log(`下拉选择: ${name} = ${val}`)
  const found = list.find((item: any) => item.value === val)
  params.value[name] = found?.text ?? ''
}

const handleShopSelect = () => {
  uni.navigateTo({
    url: '/pages/shop/indexedList'
  })
}

const handleShopClear = () => {
  if (!params.value.shopName) {
    params.value.shopId = null
    params.value.shopName = null // 空值改为null
  }
}

const expenseTypes = [
  { text: '吃', value: 'eat' },
  { text: '喝', value: 'drink' },
  { text: '玩', value: 'play' },
  { text: '乐', value: 'glad' },
  { text: '过路费', value: 'tolls' },
  { text: '车油', value: 'oil' },
  { text: '停车费', value: 'parking' },
  { text: '交通费', value: 'traffic' },
  { text: '超市', value: 'supermarket' },
  { text: '网购', value: 'online_shopping' },
  { text: '话费', value: 'phone_bill' },
  { text: '红包', value: 'red_packet' },
  { text: 'vip', value: 'vip' },
  { text: '其他', value: 'other' }
]

const paymentRange = ref([])

const rules = {
  money: { rules: [{ required: true, errorMessage: '金额不能为空' }] },
  createDate: { rules: [{ required: true, errorMessage: '创建时间不能为空' }] },
  paymentId: {
    rules: [
      { required: true, errorMessage: '支付类型不能为空' },
      { format: 'number', errorMessage: '支付类型只能输入数字' }
    ]
  }
}

const maxDate = computed(() => {
  // 返回当天结束的时间戳，确保不能选择大于当天的日期
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()
  // 创建当天23:59:59的时间戳
  const endOfDay = new Date(year, month, day, 23, 59, 59).getTime()
  return endOfDay
})

const formColumns = ref([
  // {
  //   prop: 'expensesName',
  //   label: '支出类型',
  //   placeholder: '请输入expensesName',
  //   required: true,
  //   readonly: true,
  //   disabled: true
  // },
  { prop: 'money', label: '金额', placeholder: '请输入金额', required: true, type: 'number' }
  // { prop: 'shopName', label: '店铺', placeholder: '请输入店铺' }
])

const init = async () => {
  const data = await paymentAll()
  paymentRange.value = data.map((item: any) => ({ value: item.id, text: item.payment_name }))
  console.log('获取支付类型数据:', data)
}

onShow(() => {
  params.value.shopId = userShop.data?.id
  params.value.shopName = userShop.data?.name
})

onMounted(init)

defineExpose({
  open: () => {
    popupRef.value.open()
    userShop.setUseShop(undefined)
  },
  close: () => popupRef.value.close()
})
</script>

<style lang="scss" scoped>
.popup-title {
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}
</style>
