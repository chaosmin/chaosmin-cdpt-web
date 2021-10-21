<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ALIKE_partnerName" size="mini" placeholder="保司名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_productCode" size="mini" placeholder="产品编码" style="width: 180px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ALIKE_productName" size="mini" placeholder="产品名称" style="width: 180px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="resetQuery">
        清空
      </el-button>
      <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-upload
        v-waves
        :action="uploadUrl"
        :headers="{'Authorization': 'Bearer ' + this.$store.getters.token}"
        class="filter-item"
        style="margin-top: 10px;"
        accept=".xlsx,.xls"
        :show-file-list="false"
        :on-progress="uploadProgress"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-upload">点击上传</el-button>
      </el-upload>
      <el-link target="_blank" :href="downloadUrl" :underline="false">
        <el-button v-waves class="filter-item" size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-download">下载模板</el-button>
      </el-link>
    </div>
    <el-divider content-position="left" class="app-divider">保险产品</el-divider>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
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
      <el-table-column label="保司名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一级大类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级大类" align="center">
        <template slot-scope="{row}">
          <span>{{ row.categorySubName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.productDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起保日期(T+N)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.waitingDays }}</span>
        </template>
      </el-table-column>
      <el-table-column label="包含计划数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.numberOfPlan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品状态" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | valueFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="152px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="goTo(row.id)">查看计划</el-button>
          <el-popconfirm v-if="row.status==='DISABLED'" title="您确定启用该产品吗?" @onConfirm="modifyStatus(row,'ENABLED')">
            <el-button slot="reference" size="mini" type="success" style="margin-left: 5px;">
              生效
            </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.status==='ENABLED'" title="您确定禁用该产品吗?" @onConfirm="modifyStatus(row,'DISABLED')">
            <el-button slot="reference" size="mini" type="danger" style="margin-left: 5px;">
              失效
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.P_NUM" :limit.sync="listQuery.P_SIZE" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="customWidth">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 700px; margin-left:80px;">
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="temp.productCode" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="产品大类" prop="productCategoryId" />
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="temp.productName" />
        </el-form-item>
        <el-form-item label="产品子名称" prop="productSubName">
          <el-input v-model="temp.productSubName" />
        </el-form-item>
        <el-form-item label="产品描述" prop="productDesc">
          <el-input v-model="temp.productDesc" />
        </el-form-item>
        <el-form-item label="投保提示" prop="notice" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="temp.insuranceNotice" :height="400" />
        </el-form-item>
        <el-form-item label="特约&须知" prop="external" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="temp.externalText" :height="400" />
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
import Tinymce from '@/components/Tinymce'
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
  components: { Tinymce, Pagination },
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
      uploadUrl: 'http://bl.senhaobx.com/v1/api/products/file',
      downloadUrl: 'https://cdpt-partner.oss-cn-shanghai.aliyuncs.com/%E4%BF%9D%E9%99%A9%E4%BA%A7%E5%93%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx',
      categoryId: undefined,
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        P_NUM: 1,
        P_SIZE: 20,
        EQ_productCategoryId: undefined,
        ALIKE_partnerName: undefined,
        ALIKE_productCode: undefined,
        ALIKE_productName: undefined
      },
      temp: {
        id: undefined,
        partnerId: undefined,
        productCategoryId: undefined,
        productCode: undefined,
        productName: undefined,
        productSubName: undefined,
        productDesc: undefined,
        waitingDays: undefined,
        insuranceNotice: undefined,
        externalText: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        productCategoryId: [{ required: true, message: '产品大类不能为空', trigger: 'change' }],
        productCode: [{ required: true, message: '产品编码不能为空', trigger: 'change' }],
        productName: [{ required: true, message: '产品名称不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.listQuery.EQ_productCategoryId = this.$route.params.productCategoryId
    this.listQuery.ALIKE_productName = this.$route.params.productName
    this.getList()
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
    handleFilter() {
      this.listQuery.P_NUM = 1
      this.getList()
    },
    resetQuery() {
      this.listQuery.EQ_productCategoryId = undefined
      this.listQuery.ALIKE_partnerName = undefined
      this.listQuery.ALIKE_productCode = undefined
      this.listQuery.ALIKE_productName = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        partnerId: undefined,
        productCategoryId: undefined,
        productCode: undefined,
        productName: undefined,
        productSubName: undefined,
        productDesc: undefined,
        waitingDays: undefined,
        noticeText: undefined
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
          updateProduct(this.temp.id, this.temp).then(() => {
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
    uploadProgress() {
      this.uploading = this.$loading({
        lock: true,
        text: '拼命上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    uploadSuccess() {
      this.handleFilter()
      this.uploading.close()
      this.$notify({
        title: '成功',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    uploadError() {
      this.uploading.close()
      this.$notify({
        title: '失败',
        message: '上传失败',
        type: 'danger',
        duration: 2000
      })
    },
    goTo(productId) {
      this.$router.push({ name: 'Plan', params: { productId: productId }})
    }
  }
}
</script>

<style>
.customWidth{
  width:68%;
}
</style>
