<template>
  <div class="dashboard-editor-container">
    <panel-group :data="dashboardData" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!--    <el-row :gutter="32">-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <raddar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <pie-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :lg="8">-->
    <!--        <div class="chart-wrapper">-->
    <!--          <bar-chart />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </div>
</template>

<script>

import { dashboard } from '@/api/dashboard'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart
  },
  data() {
    return {
      dashboardData: {
        policies: {
          value: 0,
          expectedData: [],
          actualData: []
        },
        premium: {
          value: 0,
          expectedData: [],
          actualData: []
        },
        insureds: {
          value: 0,
          expectedData: [],
          actualData: []
        },
        issuers: {
          value: 0,
          expectedData: [],
          actualData: []
        }
      },
      lineChartData: {}
    }
  },
  created() {
    this.getDashboardData()
  },
  methods: {
    getDashboardData() {
      dashboard().then(response => {
        this.dashboardData = response.data
        this.lineChartData = this.dashboardData.policies
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.dashboardData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
