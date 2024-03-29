<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.EQ_policyNo" size="mini" placeholder="保单号" style="width: 180px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.LIKE_policyInsurant_certiNo" size="mini" placeholder="证件号" style="width: 180px;margin-left: 10px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_policyInsurant_name" size="mini" placeholder="姓名" style="width: 180px;margin-left: 10px;" class="filter-item" clearable @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.EQ_policy_status" size="mini" placeholder="保单状态" style="width: 180px;margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-divider content-position="left">保单</el-divider>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column v-if="false" label="ID" prop="id" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="订单号">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.policyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总人数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.insuredSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起保时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终止时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expiryTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsPlan.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单时间" align="center" width="135">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保费(元)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算保费(元)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.issuerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投保人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.holder.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单状态" class-name="status-col" width="90">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="225" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;" @click="goToDetail(row.orderNo)">
            详情
          </el-button>
          <!-- 2021-07-07 13:34:04 去除可回溯按钮 -->
          <!-- <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;" @click="goToTrace(row.orderNo)"> -->
          <!--  可回溯 -->
          <!-- </el-button> -->
          <el-link v-if="row.status === 'INSURED'" target="_blank" :href="row.epolicyUrl" :underline="false">
            <el-button v-waves class="filter-item" size="mini" style="margin-left: 5px;" type="primary" icon="el-icon-download">
              保单
            </el-button>
          </el-link>
          <el-popconfirm v-if="row.status === 'INSURED' && afterNow(row.effectiveTime)" title="您确定取消该保单吗？" @onConfirm="cancelPolicy(row.id, row)">
            <el-button slot="reference" size="mini" type="warning" style="margin-left: 5px;">
              退保
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog title="查看投保流程" :visible.sync="policyKhsFormVisible" custom-class="customWidth">
      <el-form ref="khsForm" :model="khsObj" label-position="right" label-width="130px" :inline="true" style="margin-left:20px;">
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="订单号" prop="orderNo">
              <el-input v-model="khsObj.orderNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="保单号" prop="policyNo">
              <el-input v-model="khsObj.policyNo" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="投保人" prop="holderName">
              <el-input v-model="khsObj.holderName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="出单人" prop="issuerName">
              <el-input v-model="khsObj.issuerName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="进入投保页面时间" prop="enterPageTime">
              <el-input v-model="khsObj.enterPageTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="离开投保页面时间" prop="leavePageTime">
              <el-input v-model="khsObj.leavePageTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="阅读投保须知时间" prop="readTime">
              <el-input v-model="khsObj.readTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="阅读投保须知截图" prop="readPicUrl">
              <el-link icon="el-icon-document" @click="openKhsImg('阅读条款须知截图', khsObj.readPicUrl)">查看图片</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="阅读保险条款时间" prop="readTime">
              <el-input v-model="khsObj.confirmTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="阅读保险条款截图" prop="readPicUrl">
              <el-link icon="el-icon-document" @click="openKhsImg('阅读条款须知截图', khsObj.confirmPicUrl)">查看图片</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="确认投保时间" prop="issueTime">
              <el-input v-model="khsObj.issueTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="确认投保页面截图" prop="issuePicUrl">
              <el-link icon="el-icon-document" @click="openKhsImg('确认投保页面截图', khsObj.issuePicUrl)">查看图片</el-link>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog :title="khsImgName" :visible.sync="khsImgFormVisible" custom-class="customWidth">
      <el-image :src="khsImgUrl" alt="khsImg" />
    </el-dialog>
  </div>
</template>

<script>
import { getOrderTrace } from '@/api/orders'
import { fetchPolicy, cancelPolicy } from '@/api/policies'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'TO_BE_INSURED', display_name: '待承保' },
  { key: 'INSURED', display_name: '已承保' },
  { key: 'SURRENDERED', display_name: '已退保' },
  { key: 'CANCELLED', display_name: '已取消' },
  { key: 'UNDERWRITING_PASS', display_name: '已核保' }
]

const khsTypeOptions = [
  { key: 'SCHEDULE', display_name: '定时截图' },
  { key: 'POLICY_NOTICE', display_name: '阅读投保须知截图' },
  { key: 'INSU_CLAUSES', display_name: '下载保险条款截图' },
  { key: 'INSU_CONFIRM', display_name: '确认投保前截图' }
]

const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const khsTypeKeyValue = khsTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'INSURED': 'success',
        'SURRENDERED': 'danger',
        'CANCELLED': 'danger'
      }
      return statusMap[status]
    },
    rounding(value) {
      return value.toFixed(2)
    },
    valueFilter(type) {
      return statusTypeKeyValue[type]
    },
    khsTypeFilter(type) {
      return khsTypeKeyValue[type]
    }
  },
  data() {
    return {
      uploading: undefined,
      tableKey: 0,
      list: null,
      khsObj: {
        orderNo: null,
        policyNo: null,
        holderName: null,
        issuerName: null,
        enterPageTime: null,
        leavePageTime: null,
        readTime: null,
        confirmTime: null,
        issueTime: null,
        readPicUrl: null,
        confirmPicUrl: null,
        issuePicUrl: null
      },
      khsImgName: undefined,
      khsImgUrl: undefined,
      total: 0,
      listLoading: true,
      statusOptions: [{
        label: '全部',
        value: undefined
      }, {
        label: '已承保',
        value: 1
      }, {
        label: '已退保',
        value: 2
      }, {
        label: '待承保',
        value: 4
      }],
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        O_policy_createTime: 0,
        LIKE_policyInsurant_certiNo: undefined,
        ALIKE_policyInsurant_name: undefined,
        EQ_policy_status: undefined,
        EQ_policyNo: undefined
      },
      policyKhsFormVisible: false,
      khsImgFormVisible: false
    }
  },
  created() {
    this.listQuery.EQ_policyNo = this.$route.params.policyNo
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPolicy(this.listQuery).then(response => {
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
    goToTrace(orderNo) {
      getOrderTrace(orderNo).then(response => {
        this.khsObj = response.data
        this.policyKhsFormVisible = true
      })
    },
    cancelPolicy(id, row) {
      console.log('退保保单id=' + id)
      this.uploading = this.$loading({
        lock: true,
        text: '正在操作中, 请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      cancelPolicy(id, { 'status': 'SURRENDERED' }).then(response => {
        console.log(response)
        row.status = 'SURRENDERED'
        this.$notify({
          title: '成功',
          message: '退保成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        this.uploading.close()
      })
    },
    openKhsImg(imgName, imgUrl) {
      this.khsImgFormVisible = true
      this.khsImgName = imgName
      this.khsImgUrl = imgUrl
    },
    afterNow(date) {
      const dateTime = Date.parse(date)
      return dateTime > new Date().getTime()
    },
    goToDetail(orderNo) {
      this.$router.push({ name: 'PolicyDetail', params: { orderNo: orderNo }})
    }
  }
}
</script>
