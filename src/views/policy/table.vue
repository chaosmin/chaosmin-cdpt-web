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
      <!-- <el-table-column prop="children" type="expand" width="100">
        <template slot-scope="props">
          <el-table :key="1" :data="props.row.insuredList">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="gender" label="性别" />
            <el-table-column prop="certiType" label="证件类型" />
            <el-table-column prop="certiNo" label="证件号" />
            <el-table-column prop="birthday" label="生日" />
            <el-table-column prop="phoneNo" label="手机号" />
          </el-table>
        </template>
      </el-table-column> -->
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
      <el-table-column label="起保时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停保时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expiryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="旅行目的地">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.travelDestination }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="被保人数" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.insuredList.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价保费" width="80" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.unitPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总保费" width="70" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.totalPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费" width="80" align="center">
        <template slot-scope="{row}">
          <span>￥{{ row.actualPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;">
            保单详情
          </el-button>
          <el-button slot="reference" size="mini" type="primary" style="margin-left: 5px;" @click="handleKhsList(row.id)">
            查看可回溯
          </el-button>
          <el-link target="_blank" :href="row.epolicyUrl" :underline="false">
            <el-button v-waves class="filter-item" size="mini" style="margin-left: 5px;" type="primary" icon="el-icon-download">
              下载电子保单
            </el-button>
          </el-link>
          <el-popconfirm v-if="row.status==='PROCESS'" title="您确定要重新推送该保单吗?">
            <el-button slot="reference" size="mini" type="success" style="margin-left: 5px;">
              重新推送保司
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog title="可回溯文件列表" :visible.sync="policyKhsFormVisible" custom-class="customWidth">
      <el-table key="khsList" :data="khsList" border fit style="width: 100%;">
        <el-table-column label="文件时间">
          <template slot-scope="{row}">
            <span>{{ row.fileTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型">
          <template slot-scope="{row}">
            <span>{{ row.khsType | khsTypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-link target="_blank" :href="row.resourceUrl" :underline="false">
              <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-download">
                下载文件
              </el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPolicy, fetchPolicyKhs } from '@/api/policies'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'INIT', display_name: '待出单' },
  { key: 'PROCESS', display_name: '出单中' },
  { key: 'SUCCESS', display_name: '出单成功' },
  { key: 'FAILED', display_name: '出单失败' }
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
        'PROCESS': 'info',
        'SUCCESS': 'success',
        'FAILED': 'danger'
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
      khsList: null,
      total: 0,
      listLoading: true,
      statusOptions: [{
        label: '全部',
        value: undefined
      }, {
        label: '出单中',
        value: 0
      }, {
        label: '出单成功',
        value: 1
      }, {
        label: '出单失败',
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
        this.khsList = response.data
      })
      this.policyKhsFormVisible = true
    }
  }
}
</script>
