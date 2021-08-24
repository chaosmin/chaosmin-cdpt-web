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
        <el-form-item prop="timeType" label="时间类型">
          <el-select v-model="queryParam.timeType" size="mini" placeholder="选择时间范围类型">
            <el-option key="ISSUE_TIME" label="出单时间" value="ISSUE_TIME" />
            <el-option key="EFFECTIVE_TIME" label="生效时间" value="EFFECTIVE_TIME" />
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间">
          <el-date-picker v-model="queryParam.startTime" size="mini" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间">
          <el-date-picker v-model="queryParam.endTime" size="mini" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" />
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
          <span>{{ row.totalPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费" prop="actualPremium" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium | rounding }}</span>
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
          <span>{{ row.unitPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准保费" prop="totalPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.totalPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收单价" prop="actualUnitPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualUnitPremium | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收保费" prop="actualPremium" width="105" align="center">
        <template slot-scope="{row}">
          <span>{{ row.actualPremium | rounding }}</span>
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
import { fetchSubordinate } from '@/api/users'
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
        timeType: 'EFFECTIVE_TIME',
        startTime: null,
        endTime: null
      },
      rules: {
        timeType: [{ required: true, message: '请选定时间范围类型', trigger: 'change' }],
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
          getSltCheckReport(this.queryParam).then(response => {
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
          downloadSltCheckReport(this.queryParam).then((res) => {
            if (!res) return
            const filename = decodeURIComponent(res.headers['filename'])
            const type = res.headers['content-type'].split(';')[0]
            const blob = new Blob([res.data], { type: type })
            const a = document.createElement('a')
            // 创建URL
            const blobUrl = window.URL.createObjectURL(blob)
            a.download = filename
            a.href = blobUrl
            document.body.appendChild(a)
            // 下载文件
            a.click()
            // 释放内存
            URL.revokeObjectURL(blobUrl)
            document.body.removeChild(a)
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
            }, 0).toFixed(2)
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
