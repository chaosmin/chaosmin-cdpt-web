<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.LIKE_username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-checkbox v-model="showModifyInfo" class="filter-item" style="margin-left: 10px;">
        显示更新情况
      </el-checkbox>
    </div>

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
      <el-table-column label="登录名">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isAdmin" label="机构" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="100" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showModifyInfo" label="更新时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showModifyInfo" label="更新人" width="100" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.updater }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('base.actions')" align="left" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleReset(row)">重置</el-button>
          <el-button v-if="row.status===0" size="mini" type="success" @click="handleModifyStatus(row,1)">
            激活
          </el-button>
          <el-button v-if="row.status===1" size="mini" type="danger" @click="handleModifyStatus(row, 2)">
            锁定
          </el-button>
          <el-button v-if="row.status===3" size="mini" type="info" @click="handleModifyStatus(row,3)">
            解锁
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
        <el-form-item v-if="isAdmin" label="所属机构" prop="departmentId">
          <el-select
            v-model="temp.departmentId"
            filterable
            autocomplete
            reserve-keyword
            placeholder="请选择"
            style="width: 200px"
            :disabled="dialogStatus==='update'"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item v-if="isAdmin" label="角色" prop="roleId">
          <el-select
            v-model="temp.roleId"
            filterable
            reserve-keyword
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUser, createUser, updateUser } from '@/api/users'
import { fetchDepartment } from '@/api/departments'
import { fetchRole } from '@/api/roles'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: '0', display_name: '初始化' },
  { key: '1', display_name: '可用' },
  { key: '2', display_name: '不可用' },
  { key: '3', display_name: '锁定' }
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
        '0': 'info',
        '1': 'success',
        '2': 'danger',
        '3': 'danger'
      }
      return statusMap[status]
    },
    valueFilter(type) {
      return statusTypeKeyValue[type]
    }
  },
  data() {
    return {
      isAdmin: this.$store.getters.isAdmin,
      departmentOptions: [],
      roleOptions: [],
      // 是否展示修改信息
      showModifyInfo: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      optionsLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        LIKE_username: undefined,
        EQ_departmentId: this.$store.getters.department
      },
      temp: {
        id: undefined,
        departmentId: undefined,
        username: undefined,
        loginName: undefined,
        phone: undefined,
        email: undefined,
        status: undefined,
        roleId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        departmentId: [{ required: true, message: '请选择用户所属机构', trigger: 'change' }],
        loginName: [{ required: true, message: '请输入登录名', trigger: 'change' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择用户所属角色', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.loadDepartmentOptions()
    this.loadRoleOptions()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUser(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 750)
      })
    },
    handleFilter() {
      this.listQuery.P_NUM = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        departmentId: undefined,
        username: undefined,
        loginName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        status: undefined,
        roleId: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = '123456'
          if (!this.isAdmin) {
            // 非超管创建的用户, 机构为创建者同机构, 角色为出单员
            this.temp.departmentId = this.$store.getters.department
            this.temp.roleId = 3
          }
          createUser(this.temp).then(() => {
            this.dialogFormVisible = false
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
      })
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
          updateUser(this.temp.id, this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).then(() => {
            this.handleFilter()
          })
        }
      })
    },
    handleReset(row) {
      this.$confirm('确认重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.resetPassword(row.id)
      })
    },
    resetPassword(id) {
      this.resetTemp()
      this.temp.password = '123456'
      updateUser(id, this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '重置成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleModifyStatus(row, status) {
      let message, st
      if (status === 1) {
        message = '确认要激活该用户?'
        st = 1
      } else if (status === 2) {
        message = '确认要锁定该用户?'
        st = 3
      } else {
        message = '确认要解锁该用户?'
        st = 1
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.modifyStatus(row.id, st)
      })
    },
    modifyStatus(id, status) {
      this.resetTemp()
      this.temp.status = status
      updateUser(id, this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).then(() => {
        this.handleFilter()
      })
    },
    loadDepartmentOptions() {
      const listQuery = {}
      listQuery.P_NUM = 1
      listQuery.P_SIZE = 500
      this.optionsLoading = true
      fetchDepartment(listQuery).then(response => {
        this.departmentOptions = response.data.records.map(item => {
          return { value: `${item.id}`, label: `${item.name}` }
        })
        setTimeout(() => {
          this.optionsLoading = false
        }, 750)
      })
    },
    loadRoleOptions() {
      const listQuery = {}
      listQuery.P_NUM = 1
      listQuery.P_SIZE = 500
      this.optionsLoading = true
      fetchRole(listQuery).then(response => {
        this.roleOptions = response.data.records.map(item => {
          return { value: `${item.id}`, label: `${item.name}` }
        })
        setTimeout(() => {
          this.optionsLoading = false
        }, 750)
      })
    }
  }
}
</script>
