<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.EQ_policyNo" placeholder="保单号" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.EQ_policy_status" placeholder="保单状态" style="width: 180px;margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column label="保单号">
        <template slot-scope="{row}">
          <span>{{ row.policyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总人数" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.insuredList.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起保时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终止时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expiryTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单人" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投保人" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.holder.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="220" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;">
            详情
          </el-button>
          <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;" @click="handleKhsList(row.id)">
            可回溯
          </el-button>
          <el-link target="_blank" :href="row.epolicyUrl" :underline="false">
            <el-button v-waves class="filter-item" size="mini" style="margin-left: 5px;" type="primary" icon="el-icon-download">
              保单
            </el-button>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog title="查看投保流程" :visible.sync="policyKhsFormVisible" custom-class="customWidth">
      <el-form ref="khsForm" label-position="right" label-width="130px" :inline="true" style="margin-left:20px;">
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="订单号" prop="orderNo">
              <el-input :v-model="khsObj.orderNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="保单号" prop="policyNo">
              <el-input :v-model="khsObj.policyNo" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="投保人" prop="holderName">
              <el-input :v-model="khsObj.holderName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="出单人" prop="issuerName">
              <el-input :v-model="khsObj.issuerName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="进入投保页面时间" prop="enterPageTime">
              <el-input :v-model="khsObj.enterPageTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="离开投保页面时间" prop="leavePageTime">
              <el-input :v-model="khsObj.leavePageTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="阅读条款须知时间" prop="readTime">
              <el-input :v-model="khsObj.readTime" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="点击投保时间" prop="issueTime">
              <el-input :v-model="khsObj.issueTime" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form-item label="阅读条款须知截图" prop="readPicUrl">
              <el-link icon="el-icon-document" :href="khsObj.readPicUrl" target="_blank">查看图片</el-link>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="投保页面截图" prop="issuePicUrl">
              <el-link icon="el-icon-document" :href="khsObj.issuePicUrl" target="_blank">查看图片</el-link>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPolicy, fetchPolicyKhs } from '@/api/policies'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'SUCCESS', display_name: '已承保' },
  { key: 'REFUND', display_name: '已退保' }
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
        'SUCCESS': 'success',
        'REFUND': 'danger'
      }
      return statusMap[status]
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
      loading: false,
      tableKey: 0,
      list: null,
      khsObj: {
        orderNo: '',
        policyNo: '',
        holderName: '',
        issuerName: '',
        enterPageTime: '',
        leavePageTime: '',
        readTime: '',
        issueTime: '',
        readPicUrl: '',
        issuePicUrl: ''
      },
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
      }],
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        EQ_policyNo: undefined
      },
      policyKhsFormVisible: false
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
    handleKhsList(id) {
      fetchPolicyKhs(id).then(response => {
        this.khsObj = response.data
      })
      this.policyKhsFormVisible = true
    }
  }
}
</script>
