<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ALIKE_productName" placeholder="所属产品" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_planCode" placeholder="计划编码" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_planName" placeholder="计划名称" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.EQ_status" placeholder="状态" style="width: 200px;margin-left: 10px;" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="resetQuery">
        清空
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-divider content-position="left">产品计划</el-divider>
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
      <el-table-column label="产品名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划编码" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.planCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.planName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主险保额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.primaryCoverage }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="计划币种" align="center">
        <template slot-scope="{row}">
          <span>{{ row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="默认佣金比例(%)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.defaultCommissionRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="250px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="goTo(row.productName)">查看产品</el-button>
          <el-button size="mini" type="primary" style="margin-left: 5px;" @click="goToLiability(row.planCode)">查看责任</el-button>
          <el-popconfirm v-if="row.status==='ENABLED'" title="您确定禁用该计划吗?" @onConfirm="modifyStatus(row,'DISABLED')">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
              禁用
            </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.status==='DISABLED'" title="您确定启用该计划吗？" @onConfirm="modifyStatus(row,'ENABLED')">
            <el-button slot="reference" size="mini" type="warning" style="margin-left: 5px;">
              启用
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
        <el-form-item label="计划编码" prop="planCode">
          <el-input v-model="temp.planCode" disabled />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="temp.planName" />
        </el-form-item>
        <el-form-item label="主险保额" prop="primaryCoverage">
          <el-input v-model="temp.primaryCoverage" />
        </el-form-item>
        <el-form-item label="佣金比例" prop="defaultCommissionRatio">
          <el-input v-model="temp.defaultCommissionRatio" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPlan, updatePlan } from '@/api/plans'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'ENABLED', display_name: '可用' },
  { key: 'DISABLED', display_name: '禁用' }
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
        'ENABLED': 'success',
        'DISABLED': 'danger'
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
        label: '启用',
        value: 1
      }, {
        label: '禁用',
        value: 0
      }],
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        ALIKE_productName: undefined,
        ALIKE_planCode: undefined,
        ALIKE_planName: undefined,
        EQ_status: undefined
      },
      temp: {
        id: undefined,
        productId: undefined,
        planCode: undefined,
        planName: undefined,
        primaryCoverage: undefined,
        currency: undefined,
        defaultCommissionRatio: undefined,
        status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        parentName: [{ required: true, message: '父类名称不能为空', trigger: 'change' }],
        categoryCode: [{ required: true, message: '产品大类代码不能为空', trigger: 'change' }],
        categoryName: [{ required: true, message: '产品大类名称不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.listQuery.ALIKE_productName = this.$route.params.productName
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPlan(this.listQuery).then(response => {
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
    resetQuery() {
      this.listQuery.ALIKE_productName = undefined
      this.listQuery.ALIKE_planCode = undefined
      this.listQuery.ALIKE_planName = undefined
      this.listQuery.EQ_status = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        productId: undefined,
        planCode: undefined,
        planName: undefined,
        primaryCoverage: undefined,
        currency: undefined,
        defaultCommissionRatio: undefined,
        status: undefined
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePlan(this.temp.id, this.temp).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    modifyStatus(row, status) {
      this.resetTemp()
      this.temp.status = status
      updatePlan(row.id, this.temp).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    goTo(productName) {
      this.$router.push({ name: 'Product', params: { productName: productName }})
    },
    goToLiability(planCode) {
      this.$router.push({ name: 'Liability', params: { planCode: planCode }})
    }
  }
}
</script>
