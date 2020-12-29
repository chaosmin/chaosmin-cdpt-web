<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.EQ_productPlanCode" placeholder="计划编码" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_liabilityCategory" placeholder="责任大类" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_liabilityName" placeholder="责任内容" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="resetQuery">
        清空
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-checkbox v-model="showRemarkInfo" class="filter-item" style="margin-left: 10px;">
        显示备注
      </el-checkbox>
    </div>
    <el-divider content-position="left">产品责任</el-divider>
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
          <span>{{ row.planCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任大类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.liabilityCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任名称" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.liabilityName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showRemarkInfo" label="责任备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.liabilityRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" width="60px">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任金额" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showRemarkInfo" label="责任金额备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.amountRemark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:80px;">
        <el-form-item label="计划编码" prop="planCode">
          <el-input v-model="temp.planCode" disabled />
        </el-form-item>
        <el-form-item label="责任大类" prop="liabilityCategory">
          <el-input v-model="temp.liabilityCategory" />
        </el-form-item>
        <el-form-item label="责任名称" prop="liabilityName">
          <el-input v-model="temp.liabilityName" />
        </el-form-item>
        <el-form-item label="责任备注" prop="liabilityRemark">
          <el-input v-model="temp.liabilityRemark" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="责任金额" prop="amount">
          <el-input v-model="temp.amount" />
        </el-form-item>
        <el-form-item label="责任金额备注" prop="amountRemark">
          <el-input v-model="temp.amountRemark" />
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
import { fetchLiability, updateLiability } from '@/api/liabilities'
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
        EQ_productPlanCode: undefined,
        ALIKE_liabilityCategory: undefined,
        ALIKE_liabilityName: undefined
      },
      temp: {
        id: undefined,
        liabilityCategory: undefined,
        liabilityName: undefined,
        liabilityRemark: undefined,
        sort: undefined,
        amount: undefined,
        amountRemark: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        liabilityName: [{ required: true, message: '责任名称不能为空', trigger: 'change' }],
        amount: [{ required: true, message: '责任金额不能为空', trigger: 'change' }]
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
      fetchLiability(this.listQuery).then(response => {
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
      this.listQuery.ALIKE_liabilityCategory = undefined
      this.listQuery.ALIKE_liabilityName = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        liabilityCategory: undefined,
        liabilityName: undefined,
        liabilityRemark: undefined,
        sort: undefined,
        amount: undefined,
        amountRemark: undefined
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
          updateLiability(this.temp.id, this.temp).then(() => {
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
