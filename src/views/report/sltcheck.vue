<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="queryParam" class="demo-form-inline">
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

    <el-divider content-position="left">保费分类统计</el-divider>

    <el-table
      key="0"
      v-loading="loading"
      :data="report.partnerList"
      border
      fit
      show-summary
      style="width: 30%;"
    >
      <el-table-column label="保险公司" prop="partner" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准保费" prop="totalPremium" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费" prop="actualPremium" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium }}</span>
        </template>
      </el-table-column>
    </el-table>

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
      <el-table-column label="订单号" prop="orderNo" align="center">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="goodsPlanName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.goodsPlanName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人数" prop="insuredSize" width="65" align="center">
        <template slot-scope="{row}">
          <span>{{ row.insuredSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准单价" prop="unitPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.unitPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准保费" prop="totalPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收单价" prop="actualUnitPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualUnitPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费" prop="actualPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" prop="effectiveTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.effectiveTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终止时间" prop="expiryTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.expiryTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单时间" prop="issueTime" align="center">
        <template slot-scope="{row}">
          <span>{{ row.issueTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团号" prop="groupNo" align="center">
        <template slot-scope="{row}">
          <span>{{ row.groupNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保险公司" prop="partnerName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出单人" prop="issuer" align="center">
        <template slot-scope="{row}">
          <span>{{ row.issuer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地" prop="address" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSltCheckReport, downloadSltCheckReport } from '@/api/reports'
import waves from '@/directive/waves'

export default {
  name: 'SltCheckReport',
  directives: { waves },
  data() {
    return {
      uploading: undefined,
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
        startTime: null,
        endTime: null
      },
      rules: {
        startTime: [{ required: true, message: '请选择报表开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择报表结束时间', trigger: 'change' }]
      }
    }
  },
  methods: {
    getReport() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          getSltCheckReport(this.queryParam.startTime, this.queryParam.endTime).then(response => {
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
          downloadSltCheckReport(this.queryParam.startTime, this.queryParam.endTime).then((res) => {
            if (!res) return
            const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, '结算清单.xlsx')
            } else {
              const href = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.style.display = 'none'
              a.href = href
              a.download = '结算清单.xlsx'
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
        } else if (index === 3 || index === 5 || index === 7) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            if (index !== 3) {
              sums[index] += ' 元'
            }
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
