<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.LIKE_name" placeholder="保司名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplexTable',
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
        partnerCode: undefined,
        partnerName: undefined,
        publicKey: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        partnerCode: [{ required: true, message: 'code is required', trigger: 'change' }],
        partnerName: [{ required: true, message: 'name is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
    },
    handleFilter() {
      this.listQuery.P_NUM = 1
      this.getList()
    }
  }
}
</script>
