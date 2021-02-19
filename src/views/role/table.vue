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
          <span class="link-type">{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center">
        <template slot-scope="{row}">
          <span>{{ row.priority }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="85px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleAssignAuthorities(row.id)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
        <el-form-item label="编码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="temp.priority" />
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

    <el-dialog title="分配权限" :visible.sync="assignFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
        <el-tree
          ref="tree"
          :data="authorities"
          show-checkbox
          node-key="authorityId"
          accordion
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="assignAuthorities()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRole, fetchAuthorityOfRole, createRole, updateRole } from '@/api/roles'
import { fetchAuthorityTree } from '@/api/authorities'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      authorities: [],
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
        priority: undefined
      },
      dialogFormVisible: false,
      assignFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        code: [{ required: true, message: 'code is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getAuthorities()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchRole(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    getAuthorities() {
      fetchAuthorityTree().then(response => {
        this.authorities = response.data
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
        priority: undefined
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
          createRole(this.temp).then(() => {
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
    handleAssignAuthorities(id) {
      this.resetTemp()
      this.temp.id = id
      fetchAuthorityOfRole(id).then(response => {
        this.$refs['tree'].setCheckedKeys(response.data)
        setTimeout(() => {
        }, 1000)
      })
      this.assignFormVisible = true
    },
    assignAuthorities() {
      this.temp.authorityIds = this.$refs['tree'].getCheckedKeys()
      updateRole(this.temp.id, this.temp).then(() => {
        this.assignFormVisible = false
        this.$notify({
          title: '成功',
          message: '设置成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
