<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="queryParam" class="demo-form-inline">
        <el-form-item prop="userId" label="用户">
          <el-select v-model="queryParam.userId" size="mini" placeholder="选择用户ID">
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间">
          <el-date-picker v-model="queryParam.startTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间">
          <el-date-picker v-model="queryParam.endTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="download">下载</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-divider content-position="left">报表明细</el-divider>

    <el-table
      key="1"
      v-loading="loading"
      :data="report.detail"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="index" width="50" align="center" />
      <el-table-column label="产品名称" prop="goodsPlanName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsPlanName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司" prop="partnerName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价" prop="originalPrice" align="center">
        <template slot-scope="{row}">
          <span>{{ row.originalPrice | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算价" prop="settlementPrice" align="center">
        <template slot-scope="{row}">
          <span>{{ row.settlementPrice | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣" prop="discount" align="center">
        <template slot-scope="{row}">
          <span>{{ row.discount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协议佣金比" prop="agreementComsRatio" align="center">
        <template slot-scope="{row}">
          <span>{{ row.agreementComsRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算佣金比" prop="settlementComsRatio" align="center">
        <template slot-scope="{row}">
          <span>{{ row.settlementComsRatio }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算佣金" prop="settlementComs" align="center">
        <template slot-scope="{row}">
          <span>{{ row.settlementComs | rounding }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchSubordinate } from '@/api/users'
import { getSltComsReport, downloadSltComsReport } from '@/api/reports'
import waves from '@/directive/waves'

export default {
  name: 'SltCheckReport',
  directives: { waves },
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      uploading: undefined,
      userOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      report: {
        partnerList: [],
        detail: []
      },
      total: 0,
      loading: false,
      queryParam: {
        userId: null,
        startTime: null,
        endTime: null
      },
      rules: {
        userId: [{ required: true, message: '请指定出单员', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择报表开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择报表结束时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getUserOptions()
  },
  methods: {
    getUserOptions() {
      fetchSubordinate(this.$store.getters.userId).then(response => {
        this.userOptions = response.data
      })
    },
    getReport() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          getSltComsReport(this.queryParam.userId, this.queryParam.startTime, this.queryParam.endTime).then(response => {
            this.report = response.data
            setTimeout(() => {
              this.loading = false
            }, 1000)
          })
        }
      })
    },
    handleFilter() {
      this.getReport()
    },
    download() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.uploading = this.$loading({
            lock: true,
            text: '正在生成报表, 请稍后...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          downloadSltComsReport(this.queryParam.userId, this.queryParam.startTime, this.queryParam.endTime).then((res) => {
            if (!res) return
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, '个人计算佣金表.xlsx')
            } else {
              const href = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.style.display = 'none'
              a.href = href
              a.download = '个人计算佣金表.xlsx'
              a.click()
              URL.revokeObjectURL(a.href)
            }
          }).finally(() => {
            this.uploading.close()
          })
        }
      })
    },
    resetTemp() {
      this.queryParam = {
        userId: undefined,
        startTime: undefined,
        endTime: undefined
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
        } else if (index === 3 || index === 4 || index === 8) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2)
            sums[index] += ' 元'
          }
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  }
}
</script>
