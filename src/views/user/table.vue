<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.LIKE_username" size="mini" placeholder="用户名" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column label="支付方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payType | payTypeFilter }}</span>
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
      <el-table-column label="操作" align="left" width="210px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleReset(row)">重置</el-button>
          <el-popconfirm v-if="row.status==='INIT'" title="您确定激活该用户吗?" @onConfirm="modifyStatus(row,'VALID')">
            <el-button slot="reference" size="mini" type="success" style="margin-left: 5px;">
              激活
            </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.status==='VALID'" title="您确定锁定该用户吗?" @onConfirm="modifyStatus(row,'FROZEN')">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
              锁定
            </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.status==='FROZEN'" title="您确定解锁该用户吗？" @onConfirm="modifyStatus(row,'VALID')">
            <el-button slot="reference" size="mini" type="warning" style="margin-left: 5px;">
              解锁
            </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="isAdmin" title="您确定删除该用户吗?" @onConfirm="removeData(row)">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:60px;">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="temp.payType" filterable placeholder="请选择" style="width: 200px" :disabled="this.$store.getters.roles.includes('manager')">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="temp.roleIds" multiple placeholder="请选择" style="width: 200px">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button v-waves style="margin-left: 10px;" class="filter-item" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="addNewHead">
          添加抬头信息
        </el-button>
        <el-table :data="temp.letterHead" border fit highlight-current-row style="width: 100%;margin-top: 8px">
          <el-table-column type="index" label="序" align="center" />
          <el-table-column label="抬头名称" align="center" style="font-size: 12px">
            <template slot-scope="{row}"><el-input v-model="row.title" class="edit-input" size="mini" /></template>
          </el-table-column>
          <el-table-column label="证件号" align="center">
            <template slot-scope="{row}"><el-input v-model="row.certiNo" class="edit-input" size="mini" /></template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 5px;" @click.native.prevent="deleteRow(row,$index)" />
            </template>
          </el-table-column>
        </el-table>
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
import { fetchUser, createUser, updateUser, deleteUser } from '@/api/users'
import { fetchRole } from '@/api/roles'
import { fetchByUser } from '@/api/letter-head'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'INIT', display_name: '初始化' },
  { key: 'VALID', display_name: '可用' },
  { key: 'INVALID', display_name: '不可用' },
  { key: 'FROZEN', display_name: '锁定' }
]

const payTypeOptions = [
  { key: 'ONLINE', display_name: '微信支付' },
  { key: 'OFFLINE', display_name: '月结' }
]

const statusTypeKeyValue = statusTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const payTypeKeyValue = payTypeOptions.reduce((acc, cur) => {
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
        'INIT': 'info',
        'VALID': 'success',
        'INVALID': 'danger',
        'FROZEN': 'danger'
      }
      return statusMap[status]
    },
    valueFilter(type) {
      return statusTypeKeyValue[type]
    },
    payTypeFilter(type) {
      return payTypeKeyValue[type]
    }
  },
  data() {
    return {
      isAdmin: this.$store.getters.isAdmin,
      payTypeOptions: [{
        value: 'OFFLINE',
        label: '月结'
      }, {
        value: 'ONLINE',
        label: '微信支付'
      }],
      roleOptions: [],
      showModifyInfo: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      optionsLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        EQ_role_code: undefined,
        LIKE_username: undefined,
        EQ_user_creator: undefined,
        O_createTime: 0
      },
      temp: {
        id: undefined,
        username: undefined,
        loginName: undefined,
        phone: undefined,
        email: undefined,
        address: undefined,
        status: undefined,
        payType: undefined,
        letterHead: [],
        roleIds: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        loginName: [{ required: true, message: '请输入登录名', trigger: 'change' }],
        username: [{ required: true, message: '请输入联系人名称', trigger: 'change' }],
        phone: [{ required: true, message: '请输入联系人电话', trigger: 'change' }],
        address: [{ required: true, message: '请输入联系人地址', trigger: 'change' }],
        payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        roleIds: [{ type: 'array', required: true, message: '请分配角色', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
        username: undefined,
        loginName: undefined,
        password: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        status: undefined,
        payType: undefined,
        roleIds: [],
        letterHead: []
      }
    },
    handleCreate() {
      this.resetTemp()
      fetchByUser(this.$store.getters.userId).then(response => {
        this.temp.letterHead = response.data
      })
      this.temp.payType = this.$store.getters.payType
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
    removeData(row) {
      deleteUser(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).then(() => {
        this.handleFilter()
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
    modifyStatus(row, status) {
      this.resetTemp()
      this.temp.status = status
      updateUser(row.id, this.temp).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    loadRoleOptions() {
      const listQuery = {}
      listQuery.P_NUM = 1
      listQuery.P_SIZE = 500
      this.optionsLoading = true
      fetchRole(listQuery).then(response => {
        this.roleOptions = response.data.records.map(item => {
          return { value: item.id, label: `${item.name}` }
        })
        setTimeout(() => {
          this.optionsLoading = false
        }, 750)
      })
    },
    addNewHead() {
      const head = {
        title: '',
        certiNo: ''
      }
      if (this.temp.letterHead === undefined || this.temp.letterHead === null) {
        this.temp.letterHead = []
      }
      this.temp.letterHead.push(head)
    },
    deleteRow(row, index) {
      this.temp.letterHead.splice(index, 1)
    }
  }
}
</script>
