<template>
  <div class="app-container">
    <el-container>
      <el-aside width="200px" style="background: lightgray;padding: 4px;">
        <div class="custom-tree-container">
          <div class="block">
            <p align="center">产品大类
              <span>
                <el-button size="mini" type="text" style="margin-left: 10px;" @click="appendCategory(true)">
                  添加
                </el-button>
              </span>
            </p>
            <el-tree
              :data="categories"
              node-key="categoryId"
              default-expand-all
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="filter-container">
          <el-input v-model="listQuery.ALIKE_productName" placeholder="产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
          <el-table-column label="保司名称" align="center">
            <template slot-scope="{row}">
              <span>{{ row.partnerName }}</span>
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
          <el-table-column label="产品子名称" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productSubName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品描述" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="产品状态" class-name="status-col" width="80">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ row.status | valueFilter }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" width="225px" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button size="mini" type="primary">查看计划</el-button>
              <el-button size="mini" type="primary" style="margin-left: 5px;">查看特约</el-button>
              <el-popconfirm v-if="row.status==='DISABLED'" title="您确定启用该产品吗?" @onConfirm="modifyStatus(row,'ENABLED')">
                <el-button slot="reference" size="mini" type="success" style="margin-left: 5px;">
                  启用
                </el-button>
              </el-popconfirm>
              <el-popconfirm v-if="row.status==='ENABLED'" title="您确定禁用该产品吗?" @onConfirm="modifyStatus(row,'DISABLED')">
                <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
                  禁用
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />
      </el-main>>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:80px;">
        <el-form-item label="所属大类" prop="categoryId">
          <el-select
            v-model="categoryId"
            filterable
            placeholder="请选择"
            style="width: 200px"
          >
            <el-option
              v-for="item in categories"
              :key="item.categoryId"
              :label="item.label"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="temp.productCode" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="temp.productName" />
        </el-form-item>
        <el-form-item label="产品子名称" prop="productSubName">
          <el-input v-model="temp.productSubName" />
        </el-form-item>
        <el-form-item label="产品描述" prop="productDesc">
          <el-input v-model="temp.productDesc" />
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
import { fetchCategoryTree, createCategory, updateCategory, deleteCategory } from '@/api/product-categories'
import { fetchProduct, updateProduct } from '@/api/products'
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
      categories: [],
      categoryId: undefined,
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        ALIKE_productName: undefined
      },
      temp: {
        id: undefined,
        categoryId: undefined,
        partnerId: undefined,
        productCode: undefined,
        productName: undefined,
        productSubName: undefined,
        productDesc: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        productCode: [{ required: true, message: '产品编码不能为空', trigger: 'change' }],
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProduct(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    getCategories() {
      fetchCategoryTree().then(response => {
        this.categories = response.data
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
        status: undefined
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.parentId = Number(row.id)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCategory(this.temp).then(() => {
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
          updateCategory(this.temp.id, this.temp).then(() => {
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
      updateProduct(row.id, this.temp).then(() => {
        row.status = status
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    appendCategory(root, data) {
      this.$prompt('请输入大类名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let parentId
        if (root) {
          parentId = undefined
        } else {
          parentId = data.categoryId
        }
        const newCategory = { parentId: parentId, categoryCode: value, categoryName: value }
        createCategory(newCategory).then(response => {
          const d = response.data
          const newChild = { categoryId: d.id, label: d.categoryName, children: [] }
          if (root) {
            this.categories.push(newChild)
          } else {
            if (!data.children) {
              this.$set(data, 'children', [])
            }
            data.children.push(newChild)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    removeCategory(node, data) {
      this.$confirm('确认删除该产品大类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategory(data.categoryId).then(() => {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-button size='mini' type='text' on-click={ () => this.appendCategory(false, data) }>添加</el-button>
            <el-button size='mini' type='text' on-click={ () => this.removeCategory(node, data) }>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
