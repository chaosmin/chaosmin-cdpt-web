<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.EQ_status" size="mini" clearable placeholder="请选择" style="width: 180px;" class="filter-item" @change="handleFilter">
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
    </div>

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
      <el-table-column label="生效时间">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="止保时间">
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
          <span>{{ row.issuer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="75px" class-name="small-padding fixed-width">
        <!--        <template slot-scope="{row}">-->
        <!--          <el-button size="mini" type="primary" @click="loadDraft(row.orderNo)">加载</el-button>-->
        <!--        </template>-->
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

  </div>
</template>

<script>
import { fetchOrder } from '@/api/orders'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'DRAFT', display_name: '草稿箱' },
  { key: 'INIT', display_name: '待出单' },
  { key: 'SUCCESS', display_name: '已出单' },
  { key: 'FAILED', display_name: '已取消' },
  { key: 'PROCESS', display_name: '出单中' }
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
        'DRAFT': 'info',
        'INIT': 'info',
        'SUCCESS': 'success',
        'FAILED': 'danger',
        'PROCESS': 'warning'
      }
      return statusMap[status]
    },
    rounding(value) {
      return value.toFixed(2)
    },
    valueFilter(type) {
      return statusTypeKeyValue[type]
    }
  },
  data() {
    return {
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
        EQ_order_status: undefined
      }
    }
  },
  created() {
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
    loadDraft(orderNo) {
      console.log(orderNo)
    }
  }
}
</script>
