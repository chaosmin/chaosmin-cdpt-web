<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.LIKE_name" size="mini" placeholder="名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
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
      <el-table-column label="编码">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机构人数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.numberOfUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('base.status')" class-name="status-col" width="80">
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
      <el-table-column label="更新时间" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" width="100" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.updater }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="82px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popconfirm v-if="row.status==='ENABLED'" title="您确定锁定该机构及名下所有用户吗?" @onConfirm="modifyStatus(row,'DISABLED')">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">锁定</el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.status==='DISABLED'" title="您确定解锁该机构吗？" @onConfirm="modifyStatus(row,'ENABLED')">
            <el-button slot="reference" size="mini" type="warning" style="margin-left: 5px;">解锁</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:80px;">
        <el-form-item label="编码" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="支付方式" prop="payType">
          <el-select v-model="temp.payType" filterable placeholder="请选择" style="width: 200px">
            <el-option key="OFFLINE" label="月结" value="OFFLINE" />
            <el-option key="WECHAT" label="微信支付" value="WECHAT" />
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
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDepartment, createDepartment, updateDepartment } from '@/api/departments'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const statusTypeOptions = [
  { key: 'ENABLED', display_name: '可用' },
  { key: 'DISABLED', display_name: '不可用' }
]

const payTypeOptions = [
  { key: 'OFFLINE', display_name: '月结' },
  { key: 'WECHAT', display_name: '微信支付' }
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
        'ENABLED': 'success',
        'DISABLED': 'danger'
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
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        LIKE_name: undefined
      },
      temp: {
        id: undefined,
        code: undefined,
        name: undefined,
        letterHead: [],
        status: undefined,
        payType: undefined,
        numberOfUser: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '更新',
        create: '创建'
      },
      dialogPvVisible: false,
      rules: {
        code: [{ required: true, message: '请输入机构编号', trigger: 'change' }],
        name: [{ required: true, message: '请输入机构名称', trigger: 'change' }],
        payType: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchDepartment(this.listQuery).then(response => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        code: undefined,
        name: undefined,
        payType: undefined,
        letterHead: [],
        status: undefined
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
          createDepartment(this.temp).then(() => {
            this.list.unshift(this.temp)
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
          updateDepartment(this.temp.id, this.temp).then(() => {
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
      updateDepartment(row.id, this.temp).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    addNewHead() {
      const head = {
        title: '',
        certiNo: ''
      }
      this.temp.letterHead.push(head)
    },
    deleteRow(row, index) {
      this.temp.letterHead.splice(index, 1)
    }
  }
}
</script>
