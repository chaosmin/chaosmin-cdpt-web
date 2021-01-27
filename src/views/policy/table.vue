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
      <el-table-column prop="children" type="expand" width="100">
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
      </el-table-column>
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
      <el-table-column label="旅行目的地">
        <template slot-scope="{row}">
          <span>{{ row.travelDestination }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划单价保费">
        <template slot-scope="{row}">
          <span>￥{{ row.unitPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单总保费">
        <template slot-scope="{row}">
          <span>￥{{ row.totalPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费">
        <template slot-scope="{row}">
          <span>￥{{ row.actualPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保单状态" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="115px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popconfirm v-if="row.status==='PROCESS'" title="您确定要重新推送该保单吗?">
            <el-button slot="reference" size="mini" type="success" style="margin-left: 5px;">
              重新推送保司
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />
  </div>
</template>

<script>
import { fetchPolicy } from '@/api/policies'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'PROCESS', display_name: '出单中' },
  { key: 'SUCCESS', display_name: '出单成功' },
  { key: 'FAILED', display_name: '出单失败' }
]

const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
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
    }
  },
  data() {
    return {
      loading: false,
      tableKey: 0,
      list: null,
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
      }
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
    }
  }
}
</script>
