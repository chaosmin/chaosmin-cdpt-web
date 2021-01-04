<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ALIKE_goodsPlan_departmentName" placeholder="机构名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_goodsPlan_userName" placeholder="用户名称" style="width: 180px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.LIKE_productCode" placeholder="产品编码" style="width: 180px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_productName" placeholder="产品名称" style="width: 180px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="resetQuery">
        清空
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-coordinate" @click="handleCreate">
        添加授权
      </el-button>
    </div>
    <el-divider content-position="left">授权产品</el-divider>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="机构" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品编码" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.productCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productPlanName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" class-name="status-col" width="80px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="授权时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.authorizeTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权人" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <span>{{ row.authorizer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="佣金比例" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <span>{{ row.comsRatio }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popconfirm v-if="row.status==='ENABLED'" title="您确定取消该授权吗?" @onConfirm="modifyStatus(row,'DISABLED')">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
              取消授权
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog title="更新授权" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:80px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="保司" prop="partnerName">
              <el-input v-model="temp.partnerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构" prop="departmentName">
              <el-input v-model="temp.departmentName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="temp.userName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleName">
              <el-input v-model="temp.roleName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="temp.productName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="productPlanName">
              <el-input v-model="temp.productPlanName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="有效期" prop="saleDateScope">
          <div class="block">
            <el-date-picker
              v-model="temp.saleDateScope"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="默认佣金(%)" prop="maxComsRatio">
              <el-input v-model="temp.maxComsRatio" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="佣金比例(%)" prop="comsRatio">
              <el-input-number v-model="temp.comsRatio" size="small" :precision="2" :step="10" :min="0" :max="temp.maxComsRatio" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="temp.status === 'ENABLED'" type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="产品授权" :visible.sync="dialogAuthVisible" custom-class="customWidth">
      <el-divider content-position="left">请选择用户</el-divider>
      <el-form ref="authDataForm" :rules="authRules" :model="temp" label-position="left" label-width="100px" style="width: 700px; margin-left:80px;">
        <el-form-item label="用户机构" prop="departmentId">
          <el-select v-model="temp.departmentId" clearable placeholder="请选择" @change="getUserList">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="请选择用户" prop="userIds">
          <el-select
            v-model="temp.userIds"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getUserList"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">请选择产品计划</el-divider>
      <div class="filter-container">
        <el-row>
          <el-input v-model="planListQuery.LIKE_partnerCode" placeholder="保司编码" style="width: 150px;" class="filter-item" @keyup.enter.native="getProductPlanList" />
          <el-input v-model="planListQuery.ALIKE_partnerName" placeholder="保司名称" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getProductPlanList" />
          <el-input v-model="planListQuery.LIKE_productCode" placeholder="产品编码" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getProductPlanList" />
          <el-input v-model="planListQuery.ALIKE_productName" placeholder="产品名称" style="width: 150px;margin-left: 10px;" class="filter-item" @keyup.enter.native="getProductPlanList" />
          <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="getProductPlanList">
            搜索
          </el-button>
        </el-row>
        <el-row>
          <el-input v-model="defaultComsRatio" placeholder="请输入佣金值" style="width: 150px;" class="filter-item" @keyup.enter.native="setComsRatio" />
          <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" size="small" @click="setComsRatio">
            批量设置选中佣金
          </el-button>
        </el-row>
      </div>
      <el-table
        ref="productPlanTable"
        :data="productPlans"
        border
        fit
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="保司名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.partnerName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品编码" align="center">
          <template slot-scope="{row}">
            <span>{{ row.productCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.planName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="佣金" align="center">
          <template slot-scope="{row}">
            <span>{{ row.comsRatio }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="授权佣金" align="center">
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.icomsRatio"
              size="small"
              :precision="2"
              :step="10"
              :min="0.00"
              :max="row.comsRatio"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="authData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchGoodsPlan, createGoodsPlan, updateGoodsPlan } from '@/api/goods-plans'
import { fetchPlan } from '@/api/product-plans'
import { fetchDepartment } from '@/api/departments'
import { fetchUser } from '@/api/users'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import Vue from 'vue'

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
      uploading: undefined,
      categoryId: undefined,
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      planListQuery: {
        P_NUM: 1,
        P_SIZE: 500,
        EQ_productPlan_status: 1,
        LIKE_partnerCode: undefined,
        ALIKE_partnerName: undefined,
        LIKE_productCode: undefined,
        ALIKE_productName: undefined
      },
      defaultComsRatio: undefined,
      multipleSelection: [],
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        EQ_goodsPlan_status: 1,
        O_goodsPlan_createTime: 0,
        ALIKE_goodsPlan_departmentName: undefined,
        ALIKE_goodsPlan_userName: undefined,
        LIKE_productCode: undefined,
        ALIKE_productName: undefined
      },
      temp: {
        id: undefined,
        departmentId: undefined,
        departmentName: undefined,
        userName: undefined,
        roleName: undefined,
        productCode: undefined,
        productName: undefined,
        productPlanName: undefined,
        status: undefined,
        saleDateScope: [],
        authorizer: undefined,
        comsRatio: undefined,
        maxComsRatio: undefined,
        userIds: [],
        plans: {}
      },
      dialogFormVisible: false,
      dialogAuthVisible: false,
      rules: {
        comsRatio: [{ required: true, message: '佣金比例不能为空', trigger: 'change' }]
      },
      authRules: {
        userIds: [{ required: true, message: '请先选择用户', trigger: 'change' }]
      },
      productPlans: null,
      departments: null,
      users: null
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getDepartmentList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchGoodsPlan(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    getProductPlanList() {
      fetchPlan(this.planListQuery).then(response => {
        this.productPlans = response.data.records
      })
    },
    getDepartmentList() {
      const queryCond = {}
      queryCond.EQ_status = 1
      queryCond.P_SIZE = 500
      fetchDepartment(queryCond).then(response => {
        this.departments = response.data.records
      })
    },
    getUserList() {
      const queryCond = {}
      queryCond.EQ_user_status = 1
      queryCond.EQ_departmentId = this.temp.departmentId
      queryCond.P_SIZE = 500
      if (this.$store.getters.isAdmin) {
        queryCond.EQ_role_code = 'manager'
      } else {
        queryCond.EQ_role_code = 'officer'
      }
      fetchUser(queryCond).then(response => {
        this.users = response.data.records
        setTimeout(() => {
        }, 1000)
      })
    },
    handleFilter() {
      this.listQuery.P_NUM = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery.ALIKE_goodsPlan_departmentName = undefined
      this.listQuery.ALIKE_goodsPlan_userName = undefined
      this.listQuery.LIKE_productCode = undefined
      this.listQuery.ALIKE_productName = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        departmentId: undefined,
        departmentName: undefined,
        userName: undefined,
        roleName: undefined,
        goodsCode: undefined,
        goodsName: undefined,
        saleDateScope: [],
        status: undefined,
        authorizer: undefined,
        comsRatio: undefined,
        maxComsRatio: undefined,
        userIds: [],
        plans: {}
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    setComsRatio() {
      this.multipleSelection.forEach((v, i) => {
        v.icomsRatio = Number(this.defaultComsRatio)
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogAuthVisible = true
      this.$nextTick(() => {
        this.$refs['authDataForm'].clearValidate()
        this.$refs['productPlanTable'].clearSelection()
      })
    },
    authData() {
      this.$refs['authDataForm'].validate((valid) => {
        if (valid) {
          const _selectData = this.multipleSelection
          if (_selectData.length <= 0) {
            this.$alert('检测到未选择产品计划, 请至少选择一项计划进行授权', '提交失败', {
              distinguishCancelAndClose: true,
              confirmButtonText: '返回'
            })
          } else {
            const _plans = {}
            for (const plan of _selectData) {
              Vue.set(_plans, plan.id, plan.icomsRatio)
            }
            this.temp.plans = _plans
            createGoodsPlan(this.temp).then(() => {
              this.dialogAuthVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }).then(() => {
              this.handleFilter()
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateGoodsPlan(this.temp.id, this.temp).then(() => {
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
      updateGoodsPlan(row.id, this.temp).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style>
.customWidth{
  width:72%;
}
</style>
