<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.EQ_order_orderNo" size="mini" clearable placeholder="订单号" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.EQ_order_status" size="mini" clearable placeholder="请选择" style="width: 180px;margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in orderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!--      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="openPay">-->
      <!--        支付测试-->
      <!--      </el-button>-->
    </div>

    <el-divider content-position="left">订单</el-divider>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人数">
        <template slot-scope="{row}">
          <span>{{ row.insuredSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" width="120">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="止保时间" width="120">
        <template slot-scope="{row}">
          <span>{{ row.expiryTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单时间">
        <template slot-scope="{row}">
          <span>{{ row.issueTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单人">
        <template slot-scope="{row}">
          <span>{{ row.issuerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status==='DRAFT'" size="mini" type="primary" @click="loadDraft(row.orderNo)">加载</el-button>
          <el-button v-if="row.status==='SUCCESSFULLY_INSURED'" size="mini" type="primary" @click="loadPolicy(row.orderNo)">查看</el-button>
          <el-button v-if="row.status==='TO_BE_PAID'" size="mini" type="primary" @click="createPayment(row)">去支付</el-button>
          <el-button v-if="row.status==='DRAFT'" size="mini" type="danger" @click="deleteData(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog title="请支付" :visible.sync="qrCodeVisible" width="380px" center>
      <div style="padding-bottom: 10px;">
        <span style="font-size: 15px"><b>订单号：</b>{{ paymentOrderNo }}，</span>
        <span style="font-size: 15px"><b>金额：</b>{{ paymentAmount }} <b>元</b></span>
      </div>
      <div style="padding-bottom: 10px;">
        <span style="font-size: 15px"><b>微信支付</b></span>
      </div>
      <div style="padding-bottom: 10px;">
        <img :src="payQrCode" alt="qrCode">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchOrder, createPayment, deleteOrder, loadDraft } from '@/api/orders'
import { getOneTrans } from '@/api/payment-trans'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'DRAFT', display_name: '草稿箱' },
  { key: 'TO_BE_PAID', display_name: '待支付' },
  { key: 'PROCESSING', display_name: '出单中' },
  { key: 'SUCCESSFULLY_INSURED', display_name: '投保成功' },
  { key: 'FAILED_INSURED', display_name: '投保失败' }
]

const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'OrderTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'TO_BE_PAID': 'warning',
        'PROCESSING': 'warning',
        'SUCCESSFULLY_INSURED': 'success',
        'FAILED_INSURED': 'danger'
      }
      return statusMap[status]
    },
    rounding(value) {
      if (value === undefined || value === null) {
        return ''
      } else {
        return value.toFixed(2)
      }
    },
    valueFilter(type) {
      return statusTypeKeyValue[type]
    }
  },
  data() {
    return {
      qrCodeVisible: false,
      payQrCode: undefined,
      paymentOrderNo: '',
      paymentAmount: '',
      orderStatusOptions: [{
        value: '-1',
        label: '草稿'
      }, {
        value: '0',
        label: '待出单'
      }, {
        value: '1',
        label: '已出单'
      }, {
        value: '2',
        label: '已取消'
      }],
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        O_order_createTime: 0,
        EQ_order_orderNo: undefined,
        EQ_order_status: undefined
      }
    }
  },
  created() {
    this.listQuery.EQ_order_orderNo = this.$route.params.orderNo
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrder(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    handleFilter() {
      this.listQuery.P_NUM = 1
      this.getList()
    },
    deleteData(row) {
      deleteOrder(row.id).then(() => {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    loadPolicy(orderNo) {
      this.$router.push({ name: 'PolicyDetail', params: { orderNo: orderNo }})
    },
    loadDraft(orderNo) {
      loadDraft(orderNo).then(response => {
        if (response.success === true) {
          console.log('加载草稿箱成功!')
          this.$router.push({ name: '/insured/00', params: { temp: response.data }})
        } else {
          this.$notify({
            title: '失败',
            message: '加载草稿箱失败!',
            type: 'danger',
            duration: 2000
          })
        }
      })
    },
    createPayment(row) {
      createPayment(row.orderNo).then(response => {
        if (response.success === true) {
          const result = response.data
          this.paymentOrderNo = result.orderNo
          this.paymentAmount = result.amount
          this.payQrCode = result.payUrl
          this.qrCodeVisible = true
          this.listenPayStatus(this.paymentOrderNo)
        }
      })
    },
    listenPayStatus(orderNo) {
      let timer
      getOneTrans(orderNo).then(res => {
        if (res.success === true) {
          if (res.data.status === 'SUCCESS') {
            clearTimeout(timer) // 清理定时任务
            this.$router.push({ name: 'Policy' })
          } else {
            timer = setTimeout(() => {
              this.listenPayStatus(orderNo)
            }, 2000) // 每个两秒重试
          }
        }
      }).catch(e => {
        console.log(e)
        this.$router.push({ name: 'Order' })
      })
    },
    openPay() {
      this.paymentOrderNo = '202109212116180045'
      this.paymentAmount = '57.00'
      this.payQrCode = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAKAAoADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD36iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKM0UAFFFGaACijNGaACijNFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFITisjVfFGj6OD9sv4o2H8AOW/IUmxpN7GxQTivMtS+MFlESmn2UkzdnkO1T+VclqPxR8R3YbyZorRPSJRn8zS50axoTZ7wzqoySB9eKzbrxDpFln7TqVrHjqDKM/kK8BWbxN4gfh9Quw3puYf4VoWnw58UXOMWLRA95ZFX+tLmb2L9hFfFI9Yn+IvhiA4/tJJD6Rqx/pWfN8V/D0ZIUXT47rGP6muOh+EGtOR517ZRjuMsx/QVoRfBl+surL9FQ4/WleQclFbs15PjBoikBLS9b/gKj+tRf8Lj0v/oH3X4kVAnw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'
      this.qrCodeVisible = true
    }
  }
}
</script>
