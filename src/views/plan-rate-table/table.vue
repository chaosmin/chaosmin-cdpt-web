<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.EQ_productPlanCode" placeholder="计划编码" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="resetQuery">
        清空
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-divider content-position="left">责任费率表</el-divider>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="所属计划" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.productPlanCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计算公式" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.formula }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保费" align="center">
        <template slot-scope="{row}">
          <span>{{ row.premium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保费币种" align="center">
        <template slot-scope="{row}">
          <span>{{ row.premiumCurrency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="60px">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:80px;">
        <el-form-item label="计划编码" prop="productPlanCode">
          <el-input v-model="temp.productPlanCode" disabled />
        </el-form-item>
        <el-form-item label="计算公式" prop="formula">
          <el-input v-model="temp.formula" />
        </el-form-item>
        <el-form-item label="保费" prop="premium">
          <el-input v-model="temp.premium" />
        </el-form-item>
        <el-form-item label="保费币种" prop="premiumCurrency">
          <el-input v-model="temp.premiumCurrency" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
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
import { fetchRateTable, updateRateTable } from '@/api/rate-table'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      showRemarkInfo: false,
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
        EQ_productPlanCode: undefined
      },
      temp: {
        id: undefined,
        formula: undefined,
        premium: undefined,
        premiumCurrency: undefined,
        sort: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        productPlanCode: [{ required: true, message: '计划编码不能为空', trigger: 'change' }],
        formula: [{ required: true, message: '计算公式不能为空', trigger: 'change' }],
        premium: [{ required: true, message: '保费不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.listQuery.EQ_productPlanCode = this.$route.params.productPlanCode
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchRateTable(this.listQuery).then(response => {
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
      this.listQuery.EQ_productPlanCode = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        formula: undefined,
        premium: undefined,
        premiumCurrency: undefined,
        sort: undefined
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
          updateRateTable(this.temp.id, this.temp).then(() => {
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
    }
  }
}
</script>
